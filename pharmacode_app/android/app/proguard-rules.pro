# ==============================================================================
# PharmaCode ProGuard / R8 Hardened Rules
# High DEX Obfuscation (>25%) & Full Android 15/16 Compatibility
# ==============================================================================

# ─── Optimization & Obfuscation Controls ─────────────────────────────────────
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-renamesourcefileattribute SourceFile
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod
-allowaccessmodification
-repackageclasses ""

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

# ─── Firebase Core, Auth & Messaging ──────────────────────────────────────────
# ComponentRegistrars and entrypoints preserved; internal classes allowed to be obfuscated
-keep class * extends com.google.firebase.components.ComponentRegistrar
-keep class com.google.firebase.provider.FirebaseInitProvider
-keep class com.google.firebase.auth.FirebaseAuth { *; }
-keep class com.google.firebase.auth.FirebaseUser { *; }
-keep class com.google.firebase.messaging.FirebaseMessagingService { *; }
-keep class io.flutter.plugins.firebase.messaging.** { *; }
-dontwarn com.google.firebase.**

# ─── Google Play Services & Google Sign-In ────────────────────────────────────
-keep class com.google.android.gms.auth.api.signin.GoogleSignInAccount { *; }
-keep class com.google.android.gms.auth.api.signin.GoogleSignInOptions { *; }
-keep class com.google.android.gms.common.api.GoogleApiClient { *; }
-keep class com.google.android.gms.common.GoogleApiAvailability { *; }
-dontwarn com.google.android.gms.**

# ─── Google AdMob / Mobile Ads ────────────────────────────────────────────────
-keep class com.google.android.gms.ads.** { public *; }
-keep class com.google.ads.** { public *; }
-keep class com.google.android.ump.** { public *; }
-dontwarn com.google.android.gms.ads.**
-dontwarn com.google.android.ump.**

# ─── Google Play Billing / In-App Purchase ────────────────────────────────────
-keep class com.android.billingclient.api.** { public *; }
-keep class io.flutter.plugins.inapppurchase.** { *; }

# ─── Flutter PDFView ──────────────────────────────────────────────────────────
-keep class com.github.barteksc.pdfviewer.** { public *; }
-keep class io.endigo.plugins.pdfviewflutter.** { public *; }

# ─── AndroidX, Multidex & Crypto ──────────────────────────────────────────────
-keep class androidx.multidex.** { *; }
-keep class androidx.security.crypto.** { public *; }
-keep class androidx.lifecycle.ProcessLifecycleOwnerInitializer { *; }
-dontwarn androidx.**

# ─── Flutter Local Notifications & Background Receivers ───────────────────────
-keep class com.dexterous.flutterlocalnotifications.** { *; }
-keep class com.dexterous.flutterlocalnotifications.ScheduledNotificationReceiver { *; }
-keep class com.dexterous.flutterlocalnotifications.ScheduledNotificationBootReceiver { *; }

# ─── Flutter Secure Storage ───────────────────────────────────────────────────
-keep class com.it_nomads.fluttersecurestorage.** { *; }

# ─── Kotlin Metadata & Reflection ─────────────────────────────────────────────
-keepclassmembers class **$WhenMappings { <fields>; }
-keepclassmembers class kotlin.Lazy { *; }
-dontwarn kotlin.**

# ─── Prevent stripping of enum values ─────────────────────────────────────────
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# ─── General Reflection Protection ───────────────────────────────────────────
-dontwarn sun.misc.**
-dontwarn java.lang.invoke.**

