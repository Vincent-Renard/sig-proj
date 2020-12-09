package fr.univorleans.qrcodeadventure.activity;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import java.util.Objects;

import fr.univorleans.qrcodeadventure.PermissionsInterface;
import fr.univorleans.qrcodeadventure.R;

public class MainActivity extends PermissionsInterface {

    private Button buttonScanner;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try { Objects.requireNonNull(this.getSupportActionBar()).hide(); } catch (NullPointerException ignored){}
        setContentView(R.layout.activity_main);

        buttonScanner = findViewById(R.id.buttonScanner);

        /* | Permissions (class parent) */
        checkAllPermissions();

    }

    public void searchQRBar(View view) {
        try {
            Intent intent = new Intent("com.google.zxing.client.android.SCAN");
            intent.putExtra("SCAN_MODE", "QR_CODE_MODE"); // "PRODUCT_MODE for bar codes
            startActivityForResult(intent, 0);
        } catch (Exception e) {
            Uri marketUri = Uri.parse("market://details?id=com.google.zxing.client.android");
            Intent marketIntent = new Intent(Intent.ACTION_VIEW,marketUri);
            startActivity(marketIntent);

        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Context context = getApplicationContext();
        if (requestCode == 0) {

            if (resultCode == RESULT_OK) {
                String contents = data.getStringExtra("SCAN_RESULT");
                Toast.makeText(context, contents, Toast.LENGTH_SHORT).show();
            }
            if(resultCode == RESULT_CANCELED){
                //handle cancel
                Toast.makeText(context, "Error", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
