import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { TextEncoder, TextDecoder } from 'node:util';

if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextEncoder) global.TextEncoder = TextDecoder;