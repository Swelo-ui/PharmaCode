package com.pharmacode.bpharm

import android.os.Bundle
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
