package fr.univorleans.qrcodeadventure.Interface;

import android.content.Context;
import android.webkit.JavascriptInterface;

public class NavigationJSInterface {
    Context mContext;
    private int porte;

    public NavigationJSInterface(Context c) {
        mContext = c;
    }

    public void stockPorte(int localisation) {
        this.porte = localisation;
    }

    @JavascriptInterface
    public int getPorte(){
        return this.porte;
    }
}