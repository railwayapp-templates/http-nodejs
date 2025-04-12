import express from 'express';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Configuraciones
const RECEIVER = '0x1f62e7890d5db2c94c280547876b050f5d1816c5';
const REQUIRED_AMOUNT = ethers.utils.parseUnits('1', 18); // 1 WLD

// Dirección del contrato de WLD en WorldChain (actualizá esta variable con la address correcta)
const WLD_CONTRACT = '0x4c9e1bcB046c125b6C281E991e12a3aF2f3E2fE4'; 

// ABI simplificado para ERC20 (sólo necesitamos Transfer)
const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 amount)"
];

const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
const iface = new ethers.utils.Interface(ERC20_ABI);

// Endpoint para validar el pago
// Se espera que el usuario invoque: /validate/0xPAYER_ADDRESS
app.get('/validate/:wallet', async (req, res) => {
  const wallet = req.params.wallet;
  try {
    // Construímos un filtro para Transferencias desde 'wallet' a RECEIVER
    const filter = {
      address: WLD_CONTRACT,
      topics: [
        ethers.utils.id("Transfer(address,address,uint256)"),
        ethers.utils.hexZeroPad(wallet, 32),              // topic1: de (pagador)
        ethers.utils.hexZeroPad(RECEIVER, 32)              // topic2: a (receptor)
      ]
    };

    const logs = await provider.getLogs(filter);

    let valid = false;
    for (const log of logs) {
      try {
        const parsedLog = iface.parseLog(log);
        // Verificamos que el monto transferido sea al menos 1 WLD
        if (parsedLog.args.amount.gte(REQUIRED_AMOUNT)) {
          valid = true;
          break;
        }
      } catch (err) {
        // Ignoramos logs que no se puedan parsear correctamente
        continue;
      }
    }

    if (valid) {
      res.json({ success: true, download: `${process.env.HOST}/vieja.xapk` });
    } else {
      res.json({ success: false, reason: 'No se encontró el pago' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint para servir el archivo XAPK
app.get('/vieja.xapk', (req, res) => {
  // Asegurate de colocar el archivo "vieja.xapk" en la misma carpeta que server.mjs o ajustá la ruta.
  const path = require('path');
  const filePath = path.join(process.cwd(), 'vieja.xapk');
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Backend activo en http://localhost:${port}`);
});
