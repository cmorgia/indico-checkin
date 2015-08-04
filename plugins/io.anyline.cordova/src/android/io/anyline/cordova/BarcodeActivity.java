/*
 * Anyline Cordova Plugin
 * BarcodeActivity.java
 *
 * Copyright (c) 2015 9yards GmbH
 *
 * Created by martin at 2015-07-21
 */
package io.anyline.cordova;

import java.io.IOException;
import java.io.File;
import java.util.UUID;

import org.json.JSONObject;
import org.json.JSONException;

import android.app.Activity;
import android.hardware.Camera;
import android.os.Bundle;
import android.util.Log;
import android.content.Context;
import android.content.Intent;
import android.widget.TextView;
import android.widget.ImageView;
import android.view.View;
import android.view.WindowManager;

import at.nineyards.anyline.modules.barcode.BarcodeScanView;
import at.nineyards.anyline.modules.barcode.BarcodeResultListener;
import at.nineyards.anyline.camera.CameraOpenListener;
import at.nineyards.anyline.camera.AnylineViewConfig;
import at.nineyards.anyline.models.AnylineImage;
import at.nineyards.anyline.util.TempFileUtil;

public class BarcodeActivity extends Activity implements CameraOpenListener {
    private static final String TAG = BarcodeActivity.class.getSimpleName();

    private BarcodeScanView barcodeScanView;
    private String licenseKey;
    private String configJson;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        licenseKey = getIntent().getExtras().getString(AnylinePlugin.EXTRA_LICENSE_KEY, "");
        configJson = getIntent().getExtras().getString(AnylinePlugin.EXTRA_CONFIG_JSON, "");

        barcodeScanView = new BarcodeScanView(this, null);
        try{
            JSONObject json = new JSONObject(configJson);
            barcodeScanView.setConfig(new AnylineViewConfig(this, json));
        } catch(JSONException ex) {
            throw new RuntimeException("invalid JSON string - check syntax");
        }
        setContentView(barcodeScanView);

        initAnyline();
    }

    @Override
    protected void onResume() {
        super.onResume();
        barcodeScanView.startScanning();
    }

    @Override
    protected void onPause() {
        super.onPause();
        barcodeScanView.cancelScanning();
        barcodeScanView.releaseCameraInBackground();
    }

    private void initAnyline() {
        barcodeScanView.setCameraOpenListener(this);

        barcodeScanView.initAnyline(licenseKey, new BarcodeResultListener() {
            @Override
            public void onResult(String result, AnylineImage resultImage) {

                JSONObject jsonResult = new JSONObject();
                try {

                    jsonResult.put("value", result);

                    File imageFile = TempFileUtil.createTempFileCheckCache(BarcodeActivity.this,
                        UUID.randomUUID().toString(), ".jpg");

                    resultImage.save(imageFile, 90);
                    jsonResult.put("imagePath", imageFile.getAbsolutePath());

                } catch (IOException e) {
                    Log.e(TAG, "Image file could not be saved.", e);

                } catch (JSONException jsonException) {
                    //should not be possible
                    Log.e(TAG, "Error while putting image path to json.", jsonException);
                }

                if (barcodeScanView.getConfig().isCancelOnResult()) {
                    ResultReporter.onResult(jsonResult, true);
                    setResult(AnylinePlugin.RESULT_OK);
                    finish();
                } else {
                    ResultReporter.onResult(jsonResult, false);
                }
            }
        });
    }

    @Override
    public void onCameraOpened(int cameraId, Camera camera, int width, int height) {

        Log.d(TAG, "Camera opened. Frame size " + width + " x " + height + ".");
        Log.d(TAG, "Camera layout size: "
          + barcodeScanView.getWidth() + " x " + barcodeScanView.getHeight() + ".");
    }

    @Override
    public void onCameraError(Exception e) {
        throw new RuntimeException(e);
    }

}
