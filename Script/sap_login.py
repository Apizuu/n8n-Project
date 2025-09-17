import pyautogui
import subprocess
import time
import os
import sys
import argparse
import io
import pygetwindow as gw

# supaya output UTF-8 aman di beberapa environment
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# pyautogui safety
pyautogui.FAILSAFE = True  # gerakkan mouse ke pojok kiri atas untuk stop segera
pyautogui.PAUSE = 0.2      # jeda singkat antar aksi otomatis

# Ambil argument dari command line
parser = argparse.ArgumentParser()
parser.add_argument("--user", required=True, help="SAP Username")
parser.add_argument("--password", required=True, help="SAP Password")
args = parser.parse_args()

sap_username = args.user
sap_password = args.password

print(f"Username: {sap_username}")
print(f"Password: {sap_password}")

# Path ke SAP Logon
sap_path = r"C:\Program Files (x86)\SAP\FrontEnd\SAPgui\saplogon.exe"

# pastikan gambar dicari relatif ke folder script
script_dir = os.path.dirname(os.path.abspath(__file__))
fico_img = os.path.join(script_dir, "P00_FICO.png")

# 1. Jalankan SAP Logon
try:
    subprocess.Popen([sap_path])
    print("SAP Logon dijalankan...")
except FileNotFoundError:
    print("❌ Tidak ditemukan:", sap_path)
    sys.exit(1)

# kasih waktu supaya window SAP Logon muncul
time.sleep(2)

# 1a. Coba fullscreen window SAP Logon
try:
    pyautogui.hotkey("win", "up")
    print("🖥️ SAP Logon dimaksimalkan (Win+Up)")
except Exception:
    # fallback pakai Alt+Space → X
    pyautogui.hotkey("alt", "space")
    time.sleep(0.3)
    pyautogui.press("x")
    print("🖥️ SAP Logon dimaksimalkan (Alt+Space → X)")

# 2. Tunggu SAP Logon siap
time.sleep(3)

# 3. Cari tombol P00 [FICO] berdasarkan screenshot
print("Mencari tombol P00 [FICO]...")
location = pyautogui.locateCenterOnScreen(fico_img)

if not location:
    print("❌ Tombol P00 [FICO] tidak ditemukan, pastikan screenshot cocok dan tampilan SAP sama.")
    sys.exit(1)

# 4. Double click untuk buka koneksi/login
pyautogui.doubleClick(location)
print("✅ Double klik P00 [FICO] berhasil")

# beri jeda sedikit supaya form login muncul dan dapat fokus
time.sleep(1.0)

# klik sekali lagi di posisi yang sama untuk memastikan fokus ke form / field username
try:
    pyautogui.click(location)
except Exception:
    pass

time.sleep(0.4)  # jeda singkat sebelum mulai ketik

# 5. Ketik username -> TAB -> password -> ENTER
pyautogui.write(sap_username, interval=0.05)
pyautogui.press('tab')
time.sleep(0.15)
pyautogui.write(sap_password, interval=0.05)
time.sleep(0.15)
pyautogui.press('enter')

print("✅ Username & password dikirim (ikuti behavior aplikasi jika butuh jeda lebih panjang).")

# 6. Tunggu login selesai (tampilan utama SAP muncul)
time.sleep(5)  # sesuaikan durasi sesuai kecepatan login

# 7. Ambil window aktif (SAP Easy Access) dan fullscreen
windows = gw.getWindowsWithTitle("SAP")
if windows:
    sap_window = windows[0]
    try:
        sap_window.activate()
        time.sleep(1)
        sap_window.maximize()
        print("🖥️ SAP Easy Access dimaksimalkan.")
    except Exception as e:
        print("⚠️ Gagal memaksimalkan SAP window:", e)
else:
    print("⚠️ Tidak ditemukan window SAP untuk dimaksimalkan.")

# 8. Ketik transaksi KSBP
pyautogui.write("ksbp", interval=0.05)
pyautogui.press('enter')

print("✅ Transaksi KSBP dijalankan.")
