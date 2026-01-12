const connectBtn = document.getElementById("connectBtn");
const statusEl = document.getElementById("status");
const addressEl = document.getElementById("address");
const nameEl = document.getElementById("nama");
const nimEl = document.getElementById("nim");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");
const errorEl = document.getElementById("error");
const cardErrorEl = document.getElementById("card-error");


// Avalanche Fuji Testnet chainId (hex)
const AVALANCHE_FUJI_CHAIN_ID = "0xa869";

function formatAvaxBalance(balanceWei) {
  const balance = parseInt(balanceWei, 16);
  console.log({ balance });
  return (balance / 1e18).toFixed(4);
}

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("Core Wallet tidak terdeteksi. Silakan install Core Wallet.");
     cardErrorEl.hidden = false;
    errorEl.textContent = `Error: Core Wallet tidak terdeteksi. Silakan install Core Wallet.`;
    errorEl.style.color = "#fbc531";
    return;
  }

  console.log("window.ethereum", window.ethereum);

  try {
    statusEl.textContent = "Connecting...";

    // Request wallet accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const address = accounts[0];
    addressEl.textContent = address.slice(0, 6) + "..." + address.slice(-4);;

    console.log({ address });

    // Get chainId
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    console.log({ chainId });

    if (chainId === AVALANCHE_FUJI_CHAIN_ID) {
      networkEl.textContent = "✅ Avalanche Fuji Testnet";
      statusEl.textContent = "Connected ✅";
      statusEl.style.color = "#4cd137";
      nameEl.textContent = "Muhamad Reizal Putra Hidayat";
      nimEl.textContent = "221011401923";
      connectBtn.textContent = "Connected";
      connectBtn.style.backgroundColor = "#9f2828ff";

      // Get AVAX balance
      const balanceWei = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });

      console.log({ balanceWei });

      balanceEl.textContent = formatAvaxBalance(balanceWei);
      connectBtn.disabled = true;

    } else {
      networkEl.textContent = "❌ Wrong Network";
      statusEl.textContent = "Please switch to Avalanche Fuji";
      statusEl.style.color = "#fbc531";
      balanceEl.textContent = "-";
    }
  } catch (error) {
    console.error(error);
    cardErrorEl.hidden = false;
    errorEl.textContent = `Error: ${error.message || error}`;
    errorEl.style.color = "#fbc531";
    statusEl.textContent = "Connection Failed ❌";
  }
}
if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => {
    connectWallet();
  });

  window.ethereum.on("chainChanged", () => {
    window.location.reload();
  });
}


connectBtn.addEventListener("click", connectWallet);
