# PharmaCode — Firebase Push Notifications Setup Guide (Free Spark Plan)
*Step-by-Step Hindi & English Guide for 100% Free Firebase Cloud Messaging (FCM)*

---

## 🌟 Overview
Aapka PharmaCode Flutter App **Firebase Notifications ke liye already pre-wired hai**! 
Abhi bhi app ke andar Notification Center me **"Test Alert"** button dabane se notification turant work karta hai.

Jab aap apna **100% Free Firebase Project** connect karna chahein, to bas neeche diye gaye 4 steps follow karein:

---

## 📋 Step 1: Firebase Console me Free Project banayein
1. Apne browser me open karein: [console.firebase.google.com](https://console.firebase.google.com/)
2. **"Add project"** par click karein.
3. Project ka naam daalein: `PharmaCode`
4. Google Analytics ko enable rehne dein ya disable karein (dono free hain).
5. **"Create project"** par click karein. (100% Free Spark Plan rahega, koi credit card nahi chahiye!).

---

## 📱 Step 2: Android App Add karein
1. Firebase Project dashboard par Android icon (**+ Add app** -> **Android**) par click karein.
2. **Android package name** me exactly ye daalein:
   ```
   com.pharmacode.bpharm
   ```
3. **App nickname**: `PharmaCode App`
4. **"Register app"** par click karein.

---

## 📥 Step 3: `google-services.json` Download & Paste karein
1. Firebase aapko ek file dega: `google-services.json`
2. Ise download karein aur apne computer me is folder me paste kar dein:
   ```
   h:\PharmaCode\pharmacode_app\android\app\google-services.json
   ```
3. Bas! Google services file connect ho gayi.

---

## 🚀 Step 4: Notification Send karke Test karein
1. Firebase Console me left menu se **Engage** -> **Messaging** (Firebase Cloud Messaging) par jayein.
2. **"Create your first campaign"** -> **"Firebase Notification messages"** select karein.
3. Notification Title daalein: `PharmaCode Update: New Notes Added!`
4. Notification Text daalein: `Semester 6 AI in Pharma unit-wise notes are now available.`
5. Target me `com.pharmacode.bpharm` select karke **"Review"** aur **"Publish"** par click karein!
6. Aapke mobile phone par notification pop-up aa jayega!

---

## 💡 Note for 2GB RAM PC:
Aapko Firebase CLI ya heavy background tools install karne ki bilkul zaroorat nahi hai. Upar diye simple web steps se aapka Firebase 100% free plan me flawlessly chalega!
