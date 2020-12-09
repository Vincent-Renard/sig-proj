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
    public static final String baseUrl = "http://TODO/sig/";

    private final Context context;
    private final int porte;
    private final RequestQueue queue;

    public NavigationJSInterface(Context context, int porte) {
        this.context = context;
        this.porte = porte;
        this.queue = Volley.newRequestQueue(context);
    }

    @JavascriptInterface
    public int getPorte(){
        return porte;
    }

    @JavascriptInterface
    public void updateSalleFonction(int idSalle, String fonction) {
        queue.add(new JsonObjectRequest(
            Request.Method.PATCH,
            baseUrl + "rooms/" + idSalle,
            null,
            response -> Log.i("PATCH", response.toString()),
            error -> Log.e("PATCH", error.getMessage())
        ));
    }

    @JavascriptInterface
    public void updateSalleCategorie(int idSalle, String categorie) {
        return;
    }
}
