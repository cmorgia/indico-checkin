/*
 * Anyline Cordova Plugin
 * AnylinePlugin.java
 *
 * Copyright (c) 2015 9yards GmbH
 *
 * Created by martin at 2015-07-21
 */

package io.anyline.cordova;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import io.anyline.cordova.BarcodeActivity;
import io.anyline.cordova.MrzActivity;
import io.anyline.cordova.EnergyActivity;
import io.anyline.cordova.ResultReporter;


public class AnylinePlugin extends CordovaPlugin implements ResultReporter.OnResultListener {

    private static final String TAG = AnylinePlugin.class.getSimpleName();

    public static final String SCAN_BARCODE = "scanBarcode";
    public static final String SCAN_MRZ = "scanMRZ";
    public static final String SCAN_ELECTRIC_METER = "scanElectricMeter";
    public static final String SCAN_GAS_METER = "scanGasMeter";

    public static final String EXTRA_LICENSE_KEY = "EXTRA_LICENSE_KEY";
    public static final String EXTRA_CONFIG_JSON = "EXTRA_CONFIG_JSON";
    public static final String EXTRA_SCAN_MODE = "EXTRA_SCAN_MODE";

    public static final int RESULT_CANCELED = 0;
    public static final int RESULT_OK = 1;

    public static final int REQUEST_BARCODE = 0;
    public static final int REQUEST_METER = 1;
    public static final int REQUEST_MRZ = 2;

    private CallbackContext mCallbackContext;


    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        mCallbackContext = callbackContext;
        PluginResult result = null;

        Log.d(TAG, "Starting action: " + action);

        switch (action) {
            case SCAN_BARCODE:
                scan(BarcodeActivity.class, REQUEST_BARCODE, args);
                break;
            case SCAN_MRZ:
                scan(MrzActivity.class, REQUEST_MRZ, args);
                break;

            case SCAN_ELECTRIC_METER:
                args.put(EnergyActivity.SCAN_MODE_ELECTIRC);
                scan(EnergyActivity.class, REQUEST_METER, args);
                break;

            case SCAN_GAS_METER:
                args.put(EnergyActivity.SCAN_MODE_GAS);
                scan(EnergyActivity.class, REQUEST_METER, args);
                break;

            default:
                result = new PluginResult(Status.INVALID_ACTION);
                callbackContext.error("Invalid Action");
                return false;
        }

        result = new PluginResult(Status.NO_RESULT);
        result.setKeepCallback(true);
        return true;
    }

    private void scan(Class<?> activityToStart, int requestCode, JSONArray data) {
        Intent intent = new Intent(cordova.getActivity(), activityToStart);
        try {
            intent.putExtra(EXTRA_LICENSE_KEY, data.getString(0));
            if (data.length() > 1) {
                intent.putExtra(EXTRA_CONFIG_JSON, data.getString(1));
            }
            if (data.length() > 2) {
                intent.putExtra(EXTRA_SCAN_MODE, data.getInt(2));
            }

        } catch (JSONException e) {
            PluginResult result = new PluginResult(Status.INVALID_ACTION);
            mCallbackContext.error("Invalid json data array");
            return;
        }
        ResultReporter.setListener(this);
        cordova.startActivityForResult(this, intent, requestCode);
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        ResultReporter.setListener(null);
        if (resultCode == RESULT_OK) {

            //nothing todo, handeled with ResultReporter

        } else if (resultCode == RESULT_CANCELED) {
            mCallbackContext.error("Canceled");
        }
    }

    @Override
    public void onResult(Object result, boolean isFinalResult) {

        PluginResult pluginResult;
        if (result instanceof JSONObject) {
            pluginResult = new PluginResult(Status.OK, (JSONObject) result);
        } else if (result instanceof JSONArray) {
            pluginResult = new PluginResult(Status.OK, (JSONArray) result);
        } else {
            pluginResult = new PluginResult(Status.OK, result.toString());
        }
        if (!isFinalResult) {
            pluginResult.setKeepCallback(true);
        }

        mCallbackContext.sendPluginResult(pluginResult);
    }
}
