import { createApp } from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001;

const app = createApp();

app.listen(PORT, () => {
  console.log(`[EduTest Pro Backend] Server running on http://localhost:${PORT}`);
  console.log(`[EduTest Pro Backend] Modular Monolith Architecture (7 modules):`);
  console.log(`  - /api/user       (Router -> Controller -> Service -> Repository -> DB)`);
  console.log(`  - /api/catalog    (Router -> Controller -> Service -> Repository -> DB)`);
  console.log(`  - /api/exams      (Router -> Controller -> Service -> Repository -> DB)`);
  console.log(`  - /api/attempts   (Router -> Controller -> Service -> Repository -> DB)`);
  console.log(`  - /api/results    (Router -> Controller -> Service -> Repository -> DB)`);
  console.log(`  - /api/notebook   (Router -> Controller -> Service -> Repository -> DB)`);
  console.log(`  - /api/vocabulary (Router -> Controller -> Service -> Repository -> DB)`);
});
