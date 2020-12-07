package fr.univorleans.qrcodeadventure;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.webkit.WebView;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.loadUrl("http://" + "romain-asus" + ":8080/geoserver/batiment-sig/wms?service=WMS&version=1.1.0&request=GetMap&layers=batiment-sig%3Abatiment-sig&bbox=1.93260718901831%2C47.8469484265681%2C1.93423142774884%2C47.8479779084475&width=768&height=486&srs=EPSG%3A4326&format=application/openlayers");
    }
}
