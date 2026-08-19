document.addEventListener('DOMContentLoaded', () => {
  const cidrSelect = document.getElementById('cidrSelect');
  const ipInput = document.getElementById('ipInput');
  const calculateBtn = document.getElementById('calculateBtn');
  const copyResultsBtn = document.getElementById('copyResultsBtn');

  // Populate CIDR dropdown (/1 to /32)
  for (let i = 1; i <= 32; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    const hosts = i <= 30 ? Math.pow(2, 32 - i) - 2 : (i === 31 ? 2 : 1);
    const maskStr = cidrToSubnetMask(i);
    opt.textContent = `/${i} — ${maskStr} (${hosts.toLocaleString()} hosts)`;
    if (i === 24) opt.selected = true;
    cidrSelect.appendChild(opt);
  }

  // Event Listeners
  calculateBtn.addEventListener('click', calculateSubnet);
  
  // Preset buttons handler
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      ipInput.value = btn.getAttribute('data-ip');
      cidrSelect.value = btn.getAttribute('data-cidr');
      calculateSubnet();
    });
  });

  // Copy results summary
  copyResultsBtn.addEventListener('click', () => {
    const summary = `
Subnet Calculation Summary:
---------------------------
IP Address: ${ipInput.value} /${cidrSelect.value}
Network Address: ${document.getElementById('resNetAddr').textContent}
Subnet Mask: ${document.getElementById('resSubnetMask').textContent}
Broadcast Address: ${document.getElementById('resBcastAddr').textContent}
Usable Host Range: ${document.getElementById('resHostRange').textContent}
Total Usable Hosts: ${document.getElementById('resUsableHosts').textContent}
Wildcard Mask: ${document.getElementById('resWildcard').textContent}
    `.trim();

    navigator.clipboard.writeText(summary).then(() => {
      const origText = copyResultsBtn.textContent;
      copyResultsBtn.textContent = '✅ Copied!';
      setTimeout(() => copyResultsBtn.textContent = origText, 2000);
    });
  });

  // Run initial calculation
  calculateSubnet();

  // Helper Functions
  function calculateSubnet() {
    const ipStr = ipInput.value.trim();
    const cidr = parseInt(cidrSelect.value);

    if (!validateIp(ipStr)) {
      alert('Please enter a valid IPv4 address (e.g., 192.168.1.1)');
      return;
    }

    const ipInt = ipToInt(ipStr);
    const maskInt = cidrToMaskInt(cidr);
    const netInt = (ipInt & maskInt) >>> 0;
    const wildcardInt = (~maskInt) >>> 0;
    const bcastInt = (netInt | wildcardInt) >>> 0;

    let firstHostInt, lastHostInt, totalHosts;

    if (cidr <= 30) {
      firstHostInt = netInt + 1;
      lastHostInt = bcastInt - 1;
      totalHosts = Math.pow(2, 32 - cidr) - 2;
    } else if (cidr === 31) {
      firstHostInt = netInt;
      lastHostInt = bcastInt;
      totalHosts = 2;
    } else { // /32
      firstHostInt = netInt;
      lastHostInt = netInt;
      totalHosts = 1;
    }

    // Update UI Metrics
    document.getElementById('resNetAddr').textContent = intToIp(netInt);
    document.getElementById('resSubnetMask').textContent = intToIp(maskInt);
    document.getElementById('resBcastAddr').textContent = intToIp(bcastInt);
    document.getElementById('resWildcard').textContent = intToIp(wildcardInt);
    document.getElementById('resHostRange').textContent = `${intToIp(firstHostInt)} — ${intToIp(lastHostInt)}`;
    document.getElementById('resUsableHosts').textContent = totalHosts.toLocaleString();
    document.getElementById('resIpClass').textContent = getIpClass(ipInt);

    // Update Binary
    document.getElementById('binIp').textContent = ipToBinary(ipInt);
    document.getElementById('binMask').textContent = ipToBinary(maskInt);
  }

  function validateIp(ip) {
    const regex = /^(25[0-5]|24[0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|24[0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|24[0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|24[0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
  }

  function ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
  }

  function intToIp(int) {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255
    ].join('.');
  }

  function cidrToMaskInt(cidr) {
    return cidr === 0 ? 0 : ((0xFFFFFFFF << (32 - cidr)) >>> 0);
  }

  function cidrToSubnetMask(cidr) {
    return intToIp(cidrToMaskInt(cidr));
  }

  function ipToBinary(int) {
    return [
      ((int >>> 24) & 255).toString(2).padStart(8, '0'),
      ((int >>> 16) & 255).toString(2).padStart(8, '0'),
      ((int >>> 8) & 255).toString(2).padStart(8, '0'),
      (int & 255).toString(2).padStart(8, '0')
    ].join('.');
  }

  function getIpClass(ipInt) {
    const firstOctet = (ipInt >>> 24) & 255;
    if (firstOctet >= 1 && firstOctet <= 126) return 'Class A';
    if (firstOctet === 127) return 'Class A (Loopback)';
    if (firstOctet >= 128 && firstOctet <= 191) return 'Class B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'Class C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'Class D (Multicast)';
    return 'Class E (Experimental)';
  }
});