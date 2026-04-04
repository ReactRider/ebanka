<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfilePhoto extends Controller
{
    public function uploadProfilePhoto(Request $request){
        $request->validate(['image'=>'image|mimes:jpeg,png,jpg,gif|max:2048']);

        if($request->file('image')){
            $path=$request->file('image')->store('profile_images','public');
            $user=Auth::user();
            $user->profile_photo=$path;
            $user->save();
            return response()->json(['message'=>'Slika uspesno postavljena', 'path'=>$path]);
        }

        return response()->json(['message'=>'Slika nije postavljena!'],400);

    }

    public function getProfilePhoto(){
        $user = Auth::user();  
    
    if ($user && $user->profile_photo) {
        $imagePath = $user->profile_photo;
        return response()->json(['imagePath' => $imagePath], 200);
    }

    return response()->json(['message' => 'No profile image found'], 404);
    }


}
