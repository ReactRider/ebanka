<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckIfAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if(Auth::check() && Auth::user()->role == 'system_admin') {
            return $next($request); // Ako je admin, dozvoljava dalje izvršavanje
        }

        // Ako korisnik nije admin, vratiti odgovarajući odgovor
        return response()->json(['greska' => 'Nedozvoljen pristup korisnicima!'], 403);
    }
}
