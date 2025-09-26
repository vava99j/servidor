import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { 
  getPlant, 
  getPlants, 
  createPlant, 
  createUser, 
  findUser, 
  deletePlant,
  updateArduinoByHorarios,
  getArduino
} from './db.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

app.get("/plantas", async (req, res, next) => {
  try {
    const [plantas] = await getPlants();
    res.send(plantas);
  } catch (err) {
    next(err);
  }
});

app.get("/plantas/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const planta = await getPlant(id);
    res.send(planta);
  } catch (err) {
    next(err);
  }
});

app.get("/arduinos/:cod_ard", async (req, res, next) => {
  try {
    const cod_ard = req.params.cod_ard;
    const arduino = await getArduino(cod_ard);
    res.send(arduino);
  } catch (err) {
    next(err);
  }
});

app.post("/plantas", async (req, res, next) => {
  try {
    const { usuario_id, horarios, foto_url } = req.body;
    const planta = await createPlant(usuario_id, horarios, foto_url);
    res.status(201).send(planta);
  } catch (err) {
    next(err);
  }
});

app.delete("/plantas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deletePlant(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Planta não encontrada" });
    }

    res.status(200).json({ message: "Planta deletada com sucesso" }); 
  } catch (error) {
    console.error("Erro ao deletar planta:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.post("/usuarios", async (req, res, next) => {
  try {
    const { telefone, senha_hash } = req.body;
    const user = await createUser(telefone, senha_hash);
    res.status(201).send(user);
  } catch (err) {
    next(err);
  }
});

app.post("/login", async (req, res) => {
  const { telefone, senha_hash } = req.body;
  try {
    const userId = await findUser(telefone, senha_hash);
    if (!userId) {
      return res.status(401).json({ error: "Telefone ou senha inválidos" });
    }
    res.json({ id: userId }); 
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.patch("/arduinos/:cod_ard", async (req, res) => {
  try {
    const { cod_ard } = req.params;
    const {usuario_id} = req.usuario_id
    const { horarios } = req.body;

    const updated = await updateArduinoByHorarios(cod_ard, usuario_id ,horarios);

    if (updated) {
      res.json({ message: "Arduino atualizado com sucesso!" });
    } else {
      res.status(404).json({ error: "Arduino não encontrado." });
    }
  } catch (err) {
    console.error("Erro ao atualizar Arduino:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});



app.use((err, req, res, next) => {
  console.error("🔥 Erro no servidor:", err.message);
  res.status(500).json({ error: err.message });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
