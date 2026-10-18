# ==============================================================================
# PharmaCode ProGuard / R8 Hardened Security & Obfuscation Rules
# Full R8 optimization compliant with Google Play DEX code optimization thresholds
# ==============================================================================

# ─── Optimization & Obfuscation Controls ─────────────────────────────────────
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-optimizationpasses 5
-renamesourcefileattribute SourceFile
-keepattributes SourceFile,LineNumberTable
-verbose

# ─── Strip Sensitive Debugging Logs in Release Builds ─────────────────────────
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
    public static int i(...);
    public static int w(...);
}

# ─── Flutter Engine & Plugin Registrants ──────────────────────────────────────
# Retain only plugin registrant interfaces and essential embedding entry points.
# Internal Flutter classes are allowed to be freely obfuscated by R8.
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

# ─── Google Play Services, Firebase & AdMob ───────────────────────────────────
# Note: Firebase and Play Services AARs supply their own consumer ProGuard rules.
# Blanket -keep rules have been removed to ensure DEX obfuscation > 25% threshold.
-dontwarn com.google.android.gms.**
-dontwarn com.google.firebase.**
-dontwarn com.google.android.ump.**

# ─── AndroidX & Lifecycle ─────────────────────────────────────────────────────
-keep class androidx.multidex.** { *; }
-keep class androidx.security.crypto.** { *; }
-dontwarn androidx.**

# ─── Flutter Local Notifications & Background Receivers ───────────────────────
-keep class com.dexterous.flutterlocalnotifications.** { *; }

# ─── Attributes & Reflection Protection ───────────────────────────────────────
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod
-dontwarn sun.misc.**
-dontwarn java.lang.invoke.**
-dontwarn kotlin.**
