import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import { registerLicense } from '@syncfusion/ej2-base';

// 🔐 Paste your key inside the string below (keep it private)
registerLicense('Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXtcc3VSRGFYVUN/WEFWYUA=');  // replace with your real license key
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
