/*
 * Anyline Cordova Plugin
 * EnergyActivity.java
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
import at.nineyards.anyline.modules.energy.EnergyResultListener;
import at.nineyards.anyline.modules.energy.EnergyScanView;
import at.nineyards.anyline.camera.CameraOpenListener;
import at.nineyards.anyline.camera.AnylineViewConfig;
import at.nineyards.anyline.models.AnylineImage;
import at.nineyards.anyline.util.TempFileUtil;


public class EnergyActivity extends Activity implements CameraOpenListener {
    private static final String TAG = EnergyActivity.class.getSimpleName();

    public static final int SCAN_MODE_ELECTIRC = 0;
    public static final int SCAN_MODE_GAS = 1;

    private EnergyScanView energyScanView;
    private String licenseKey;
    private String configJson;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        Bundle extras = getIntent().getExtras();
        licenseKey = extras.getString(AnylinePlugin.EXTRA_LICENSE_KEY, "");
        configJson = extras.getString(AnylinePlugin.EXTRA_CONFIG_JSON, "");
        int scanModeInt = extras.getInt(AnylinePlugin.EXTRA_SCAN_MODE, 0);

        energyScanView = new EnergyScanView(this, null);
        energyScanView.setConfigFromJsonString(configJson);

        if (scanModeInt == SCAN_MODE_GAS) {
            energyScanView.setScanMode(EnergyScanView.ScanMode.GAS_METER);
        } else {
            energyScanView.setScanMode(EnergyScanView.ScanMode.ELECTRIC_METER);
        }

        setContentView(energyScanView);

        initAnyline();
    }

    @Override
    protected void onResume() {
        super.onResume();
        energyScanView.startScanning();
    }

    @Override
    protected void onPause() {
        super.onPause();

        energyScanView.cancelScanning();
        energyScanView.releaseCameraInBackground();
    }

    private void initAnyline() {
        energyScanView.setCameraOpenListener(this);

        energyScanView.initAnyline(licenseKey, new EnergyResultListener() {

            @Override
            public void onResult(EnergyScanView.ScanMode scanMode, String result,
                                 AnylineImage resultImage, AnylineImage fullImage) {


                JSONObject jsonResult = new JSONObject();

                try {
                    if (scanMode == EnergyScanView.ScanMode.GAS_METER) {
                        jsonResult.put("meterType", "Gas Meter");
                    } else {
                        jsonResult.put("meterType", "Electric Meter");
                    }

                    jsonResult.put("reading", result);

                    File imageFile = TempFileUtil.createTempFileCheckCache(EnergyActivity.this,
                        UUID.randomUUID().toString(), ".jpg");

                    resultImage.save(imageFile, 90);
                    jsonResult.put("imagePath", imageFile.getAbsolutePath());

                    imageFile = TempFileUtil.createTempFileCheckCache(EnergyActivity.this,
                        UUID.randomUUID().toString(), ".jpg");
                    fullImage.save(imageFile, 90);
                    jsonResult.put("fullImagePath", imageFile.getAbsolutePath());

                } catch (IOException e) {
                    Log.e(TAG, "Image file could not be saved.", e);

                } catch (JSONException jsonException) {
                    //should not be possible
                    Log.e(TAG, "Error while putting image path to json.", jsonException);
                }


                if (energyScanView.getConfig().isCancelOnResult()) {
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
          + energyScanView.getWidth() + " x " + energyScanView.getHeight() + ".");
    }

    @Override
    public void onCameraError(Exception e) {
        throw new RuntimeException(e);
    }

}
