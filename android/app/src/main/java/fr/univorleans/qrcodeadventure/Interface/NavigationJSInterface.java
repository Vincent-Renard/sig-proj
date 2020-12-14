package fr.univorleans.qrcodeadventure.Interface;

import android.content.Context;
import android.util.Log;
import android.webkit.JavascriptInterface;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

public class NavigationJSInterface {
    private final int porte;

    public NavigationJSInterface(Context context, int porte) {
        this.porte = porte;
    }

    @JavascriptInterface
    public int getPorte(){
        return porte;
    }

}
