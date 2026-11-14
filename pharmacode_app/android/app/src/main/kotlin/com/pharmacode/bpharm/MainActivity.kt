package com.pharmacode.bpharm

import android.os.Build
import android.os.Bundle
import android.view.Display
import android.view.WindowManager
import androidx.activity.enableEdgeToEdge
import io.flutter.embedding.android.FlutterFragmentActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterFragmentActivity() {
    private val securityChannel = "com.pharmacode.bpharm/security"
    private var isSecureEnabled = false

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        setOptimalDisplayMode()
    }

    override fun onPostResume() {
        super.onPostResume()
        setOptimalDisplayMode()
    }

    /**
     * Unlocks the device's peak display refresh rate (90Hz / 120Hz / 144Hz)
     * preventing Android OS from throttling Flutter's surface to 60fps.
     */
    private fun setOptimalDisplayMode() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            try {
                val display: Display? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    display
                } else {
                    @Suppress("DEPRECATION")
                    windowManager.defaultDisplay
                }
                val modes = display?.supportedModes ?: return
                var maxMode: Display.Mode? = null
                var maxRefreshRate = 60.0f
                for (mode in modes) {
                    if (mode.refreshRate > maxRefreshRate) {
                        maxRefreshRate = mode.refreshRate
                        maxMode = mode
                    }
                }
                if (maxMode != null) {
                    val params = window.attributes
                    params.preferredDisplayModeId = maxMode.modeId
                    window.attributes = params
                }
            } catch (_: Exception) {
                // Graceful fallback to default display mode
            }
        }
    }

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, securityChannel).setMethodCallHandler { call, result ->
            when (call.method) {
                "enableSecureScreen" -> {
                    runOnUiThread {
                        window.setFlags(
                            WindowManager.LayoutParams.FLAG_SECURE,
                            WindowManager.LayoutParams.FLAG_SECURE
                        )
                        isSecureEnabled = true
                    }
                    result.success(true)
                }
                "disableSecureScreen" -> {
                    runOnUiThread {
                        window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
                        isSecureEnabled = false
                    }
                    result.success(true)
                }
                "isSecureScreenEnabled" -> {
                    result.success(isSecureEnabled)
                }
                else -> {
                    result.notImplemented()
                }
            }
        }
    }
}
