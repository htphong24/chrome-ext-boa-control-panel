:: Change HKCU to HKLM if you want to install globally.
:: Deletes the entry created by install_host.bat
REG DELETE "HKCU\Software\Google\Chrome\NativeMessagingHosts\boa_ssms" /f
