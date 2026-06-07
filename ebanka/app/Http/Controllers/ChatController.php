<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function respond(Request $request)
    {
        $userMessage = $request->input('message', '');
        $history     = $request->input('history', []);

        if (empty(trim($userMessage))) {
            return response()->json(['reply' => ''], 422);
        }

        $apiKey = env('GEMINI_API_KEY');

        // Gemini uses "model" for assistant role, not "assistant"
        $contents = [];
        foreach ($history as $entry) {
            if (isset($entry['role'], $entry['content'])) {
                $contents[] = [
                    'role'  => $entry['role'] === 'model' ? 'model' : 'user',
                    'parts' => [['text' => $entry['content']]],
                ];
            }
        }

        // Gemini requires the conversation to start with a "user" turn
        while (!empty($contents) && $contents[0]['role'] === 'model') {
            array_shift($contents);
        }

        $contents[] = [
            'role'  => 'user',
            'parts' => [['text' => $userMessage]],
        ];

        $response = Http::asJson()->post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}",
            [
                'system_instruction' => [
                    'parts' => [['text' => 'You are a helpful assistant for an online banking application called eBanka. Help users with questions about their accounts, transactions, transfers, and general banking features. Be concise and friendly.']],
                ],
                'contents' => $contents,
            ]
        );

        if ($response->failed()) {
            \Log::error('Gemini API error', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            return response()->json(['reply' => 'Sorry, I could not get a response. Please try again.']);
        }

        $reply = $response->json('candidates.0.content.parts.0.text', 'Sorry, I could not understand the response.');

        return response()->json(['reply' => $reply]);
    }
}
