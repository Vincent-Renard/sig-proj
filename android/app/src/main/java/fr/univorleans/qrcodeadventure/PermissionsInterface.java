package fr.univorleans.qrcodeadventure;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

/* | Class parent pour gèrer les permissions et éviter une duplication de code */
@SuppressLint("Registered")
public class PermissionsInterface extends AppCompatActivity {

    /* | Variables pour les persmissions */
    private static final int CAMERA_PERMISSION_CODE = 101;
    private static final int INTERNET_PERMISSION_CODE = 102;
    private static final int ACCESS_NETWORK_STATE_CODE = 103;

    /* | Permet de vérifier toutes les permissions de l'app */
    public void checkAllPermissions(){
        checkAndAskPermission("internet");
        checkAndAskPermission("camera");
        checkAndAskPermission("network");
    }

    public void checkAndAskPermission(String permission) {
        String permission_real = switchStringToManifest(permission);
        if(!permission_real.equals("error")) {
            int requestCode;

            switch (permission) {
                case (Manifest.permission.CAMERA):
                    requestCode = CAMERA_PERMISSION_CODE;
                    break;
                case (Manifest.permission.ACCESS_NETWORK_STATE):
                    requestCode = ACCESS_NETWORK_STATE_CODE;
                    break;
                default:
                    requestCode = INTERNET_PERMISSION_CODE;
                    break;
            }
            if (ContextCompat.checkSelfPermission(getApplicationContext(), permission_real) == PackageManager.PERMISSION_DENIED) {
                ActivityCompat.requestPermissions(PermissionsInterface.this, new String[] { permission_real }, requestCode);
            }
        }
    }

    public boolean checkPermission(String permission){
        String permission_real = switchStringToManifest(permission);
        if(!permission_real.equals("error")) {
            /* | Si internet alors test en plus pour la connectivité ET internet qui fonctionne */
            if(permission.equals("internet")){
                if(ContextCompat.checkSelfPermission(getApplicationContext(), permission_real) == PackageManager.PERMISSION_GRANTED) {
                    ConnectivityManager cm = (ConnectivityManager) getApplicationContext().getSystemService(Context.CONNECTIVITY_SERVICE);
                    if(checkPermission("network") && cm != null){
                        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
                        return activeNetwork != null && activeNetwork.isConnectedOrConnecting();
                    }
                }
                return false;
            }
            else{
                return ContextCompat.checkSelfPermission(getApplicationContext(), permission_real) == PackageManager.PERMISSION_GRANTED;
            }
        }
        return false;
    }

    /* | Méthode pour faire le switch entre un string et le string présent dans le manifest */
    public String switchStringToManifest(String s){
        String permission_real;
        switch (s){
            case "internet":
                permission_real = Manifest.permission.INTERNET;
                break;
            case "camera":
                permission_real = Manifest.permission.CAMERA;
                break;
            case "network":
                permission_real = Manifest.permission.ACCESS_NETWORK_STATE;
                break;
            default:
                permission_real = "error";
        }
        return permission_real;
    }
}
