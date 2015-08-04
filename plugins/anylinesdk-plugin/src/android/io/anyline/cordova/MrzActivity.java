/*
 * Anyline Cordova Plugin
 * MrzActivity.java
 *
 * Copyright (c) 2015 9yards GmbH
 *
 * Created by martin at 2015-07-21
 */
package io.anyline.cordova;

import java.io.IOException;
import java.io.File;
import java.util.UUID;

import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.Intent;
import android.view.WindowManager;
import android.app.Activity;
import android.hardware.Camera;
import android.os.Bundle;
import android.util.Log;

import at.nineyards.anyline.models.AnylineImage;
import at.nineyards.anyline.modules.mrz.MrzScanView;
import at.nineyards.anyline.modules.mrz.MrzResultListener;
import at.nineyards.anyline.modules.mrz.Identification;
import at.nineyards.anyline.camera.CameraOpenListener;
import at.nineyards.anyline.camera.AnylineViewConfig;
import at.nineyards.anyline.models.AnylineImage;
import at.nineyards.anyline.util.TempFileUtil;


public class MrzActivity extends Activity implements CameraOpenListener {
    private static final String TAG = MrzActivity.class.getSimpleName();

    private MrzScanView mrzScanView;
    private String licenseKey;
    private String configJson;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        licenseKey = getIntent().getExtras().getString(AnylinePlugin.EXTRA_LICENSE_KEY, "");
        configJson = getIntent().getExtras().getString(AnylinePlugin.EXTRA_CONFIG_JSON, "");

        mrzScanView = new MrzScanView(this, null);
        try{
            JSONObject json = new JSONObject(configJson);
            mrzScanView.setConfig(new AnylineViewConfig(this, json));
        } catch(JSONException ex) {
            throw new RuntimeException("invalid JSON string - check syntax");
        }
        setContentView(mrzScanView);

        initAnyline();
    }

    @Override
    protected void onResume() {
        super.onResume();
        mrzScanView.startScanning();
    }

    @Override
    protected void onPause() {
        super.onPause();

        mrzScanView.cancelScanning();
        mrzScanView.releaseCameraInBackground();
    }

    private void initAnyline() {
        mrzScanView.setCameraOpenListener(this);

        mrzScanView.initAnyline(licenseKey, new MrzResultListener() {

            @Override
            public void onResult(Identification mrzResult, AnylineImage anylineImage) {

                JSONObject jsonResult = mrzResult.toJSONObject();

                try {
                    File imageFile = TempFileUtil.createTempFileCheckCache(MrzActivity.this,
                        UUID.randomUUID().toString(), ".jpg");
                    anylineImage.save(imageFile, 90);
                    jsonResult.put("imagePath", imageFile.getAbsolutePath());

                } catch (IOException e) {
                    Log.e(TAG, "Image file could not be saved.", e);

                } catch (JSONException jsonException) {
                    //should not be possible
                    Log.e(TAG, "Error while putting image path to json.", jsonException);
                }

                if (mrzScanView.getConfig().isCancelOnResult()) {
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
          + mrzScanView.getWidth() + " x " + mrzScanView.getHeight() + ".");
    }

    @Override
    public void onCameraError(Exception e) {
        throw new RuntimeException(e);
    }

}
