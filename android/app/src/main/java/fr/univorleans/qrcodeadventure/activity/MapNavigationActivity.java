package fr.univorleans.qrcodeadventure.activity;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Bundle;
import android.webkit.WebView;
import android.widget.Toast;

import fr.univorleans.qrcodeadventure.Interface.NavigationJSInterface;
import fr.univorleans.qrcodeadventure.R;

public class MapNavigationActivity extends AppCompatActivity {
    private WebView webView;
    private NavigationJSInterface interfaceJS;

    @SuppressLint("JavascriptInterface")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_map_navigation);
        Context context = getApplicationContext();
        int localisation = getIntent().getIntExtra("localisation", -1);
        if(localisation == -1){
            Toast.makeText(context, "Problème de localisation...", Toast.LENGTH_SHORT).show();
        }
        else{
            interfaceJS = new NavigationJSInterface(this);
            interfaceJS.stockPorte(localisation);
            webView = findViewById(R.id.webview);
            webView.getSettings().setJavaScriptEnabled(true);
            webView.getSettings().setDomStorageEnabled(true);
            webView.addJavascriptInterface(interfaceJS, "InterfaceAndroid");
            webView.loadUrl("http://ad-laptop:8080/projet/");
        }
    }
}