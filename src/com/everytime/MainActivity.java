package com.everytime;

import android.os.Bundle;
import org.apache.cordova.*;

public class MainActivity extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
    	//super.setIntegerProperty("splashscreen", R.drawable.splashscreen);
        //super.onCreate(savedInstanceState);
       
        // Set by <content src="index.html" /> in config.xml
        //super.loadUrl(Config.getStartUrl());
        //super.loadUrl("file:///android_asset/www/index.html");
    	super.onCreate(savedInstanceState);
        
    	//super.setIntegerProperty("splashscreen", R.drawable.splash);
        super.loadUrl(Config.getStartUrl());
    }
}
