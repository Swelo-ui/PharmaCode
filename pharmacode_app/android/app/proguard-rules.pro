# ==============================================================================
# PharmaCode ProGuard / R8 Hardened Rules
# Fixes crash caused by R8 fullMode stripping runtime-required classes
# ==============================================================================

# ─── Optimization & Obfuscation Controls ─────────────────────────────────────
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-optimizationpasses 5
-renamesourcefileattribute SourceFile
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# ─── Strip Sensitive Debugging Logs in Release Builds ─────────────────────────
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
    public static int i(...);
    public static int w(...);
}

# ─── Flutter Engine & Plugin Registrants ──────────────────────────────────────
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class * implements io.flutter.plugin.common.PluginRegistry$PluginRegistrantCallback { *; }
-keep class * implements io.flutter.embedding.engine.plugins.FlutterPlugin { *; }
-dontwarn io.flutter.embedding.**

# ─── App Activity Entrypoint ──────────────────────────────────────────────────
-keep class com.pharmacode.bpharm.MainActivity { *; }
-keep class io.flutter.embedding.android.FlutterActivity { *; }
-keep class io.flutter.embedding.android.FlutterFragmentActivity { *; }

# ─── Firebase Core & Auth ─────────────────────────────────────────────────────
# CRITICAL: R8 fullMode strips these without explicit keeps causing runtime crash
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.internal.firebase_auth.** { *; }
-keep class com.google.android.gms.auth.** { *; }
-keepnames class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# ─── Google Play Services & Sign-In ──────────────────────────────────────────
-keep class com.google.android.gms.** { *; }
-keep class com.google.android.gms.common.** { *; }
-keep class com.google.android.gms.auth.api.** { *; }
-keep class com.google.android.gms.signin.** { *; }
-keepnames class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

# ─── Google AdMob / Mobile Ads ────────────────────────────────────────────────
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.ads.** { *; }
-keep class com.google.android.ump.** { *; }
-dontwarn com.google.android.ump.**

# ─── Firebase Cloud Messaging ─────────────────────────────────────────────────
-keep class com.google.firebase.messaging.** { *; }
-keep class io.flutter.plugins.firebase.messaging.** { *; }

# ─── AndroidX & Lifecycle ─────────────────────────────────────────────────────
-keep class androidx.multidex.** { *; }
-keep class androidx.security.crypto.** { *; }
-keep class androidx.lifecycle.** { *; }
-dontwarn androidx.**

# ─── Flutter Local Notifications & Background Receivers ───────────────────────
-keep class com.dexterous.flutterlocalnotifications.** { *; }
-keep class com.dexterous.flutterlocalnotifications.ScheduledNotificationReceiver { *; }
-keep class com.dexterous.flutterlocalnotifications.ScheduledNotificationBootReceiver { *; }

# ─── Flutter Secure Storage ───────────────────────────────────────────────────
-keep class com.it_nomads.fluttersecurestorage.** { *; }

# ─── Kotlin Metadata & Reflection ─────────────────────────────────────────────
-keep class kotlin.** { *; }
-keep class kotlin.Metadata { *; }
-dontwarn kotlin.**
-keepclassmembers class **$WhenMappings { <fields>; }
-keepclassmembers class kotlin.Lazy { *; }

# ─── Prevent stripping of enum values ─────────────────────────────────────────
-keepclassmembers enum * { *; }

# ─── General Reflection Protection ───────────────────────────────────────────
-dontwarn sun.misc.**
-dontwarn java.lang.invoke.**

