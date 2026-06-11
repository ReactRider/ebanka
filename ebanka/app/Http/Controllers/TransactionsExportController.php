<?php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\Transakcija;
use Illuminate\Http\Request;
use TCPDF;
use Carbon\Carbon;

class TransactionsExportController extends Controller
{
    public function export($racun_id, $mesec, $godina) {
        $user = Auth::user();
        $racun = $user->racun()->find($racun_id);
        if (!$racun) {
            return response()->json(['message' => 'Nemate pristup ovom računu.'], 403);
        }

        $mesec_pomocna = $mesec;
        switch($mesec) {
            case 'Januar':
                $mesec = 'January';
                break;
            case 'Februar':
                $mesec = 'February';
                break;
            case 'Mart':
                $mesec = 'March';
                break;
            case 'Maj':
                $mesec = 'May';
                break;
            case 'Jun':
                $mesec = 'June';
                break;
            case 'Jul':
                $mesec = 'July';
                break;
            case 'Avgust':
                $mesec = 'August';
                break;
            case 'Septembar':
                $mesec = 'September';
                break;
            case 'Oktobar':
                $mesec = 'October';
                break;
            case 'Novembar':
                $mesec = 'November';
                break;
            case 'Decembar':
                $mesec = 'December';
                break;
            default:
                $mesec = $mesec;                                           
        }

        try {
            $date = Carbon::createFromFormat('F', $mesec)->year($godina);
        } catch(Exception $e) {
            return response()->json(['greska' => 'Neispravan format meseca'], 400);
        }

        $transactionsQuery = Transakcija::where('racun_id', $racun_id);

        $startOfMonth = $date->startOfMonth()->format('Y-m-d');
        $endOfMonth = $date->endOfMonth()->format('Y-m-d');

        $transactionsQuery->whereBetween('datum', [$startOfMonth, $endOfMonth]);

        $transactions = $transactionsQuery->get();

        if($transactions->count() === 0){
            $emptyBlob = '';
        return response($emptyBlob)
            ->header('Content-Type', 'application/pdf')->header('Content-Disposition', 'inline; filename="empty_transakcije_racun_' . $racun_id . '.pdf"');
        }

        $html = '<!DOCTYPE html>
            <html lang="sr">
            <head>
                <meta charset="UTF-8">
                <title>Export Transakcija</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    table, th, td {
                        border: 1px solid black;
                    }
                    th, td {
                        padding: 4px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }

                    .brrac {
                        font-size: .85em;
                    }   
                </style>
            </head>
            <body>
                <h1>Pregled transakcija racuna: ' . $mesec_pomocna . ' ' . $godina . '. godine   </h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID Transakcije</th>
                            <th>Broj Racuna Primaoca</th>
                            <th>Datum</th>
                            <th>Iznos</th>
                            <th>Vreme</th>
                            <th>Opis</th>
                        </tr>
                    </thead>
                    <tbody>';
    
            foreach ($transactions as $transaction) {
                $html .= '<tr>
                            <td class="brrac">' . $transaction->id . '</td>
                            <td class="brrac">' . $transaction->broj_racuna_primaoca . '</td>
                            <td>' . $transaction->datum . '</td>
                            <td>' . $transaction->iznos . ' RSD</td>
                            <td>' . $transaction->vreme . '</td>
                            <td>' . $transaction->opis_transakcije . '</td>
                        </tr>';
            }
    
            $html .= '</tbody></table></body></html>';
            
            $pdf = new TCPDF();
            $pdf->AddPage();
            $pdf->SetFont('dejavusans', '', 10);
    
            $pdf->writeHTML($html, true, false, true, false, '');
    
            $pdfContent = $pdf->Output('transakcije_racun_' . $racun_id . '.pdf', 'S');

            return response($pdfContent)
            ->header("Content-Type", "application/pdf")
            ->header('Content-Disposition', 'inline;filename="transakcije_racun_' . $racun_id . '.pdf"');
        }     
}
