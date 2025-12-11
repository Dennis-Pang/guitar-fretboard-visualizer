
import { calculateScale, getNoteIndex } from './src/utils/musicTheory.js';

// Mock dependencies if needed, or just run with node if imports work (might need type module)

console.log('--- Testing F Major (Expect Bb) ---');
const fMajor = calculateScale('F', 'major', 'ionian');
fMajor.forEach(n => console.log(`${n.degree}: ${n.note}`));

console.log('\n--- Testing C Minor (Aeolian) (Expect Eb, Ab, Bb) ---');
const cMinor = calculateScale('C', 'major', 'aeolian');
cMinor.forEach(n => console.log(`${n.degree}: ${n.note}`));

console.log('\n--- Testing C# Major (Expect sharps) ---');
const cSharpMajor = calculateScale('C#', 'major', 'ionian');
cSharpMajor.forEach(n => console.log(`${n.degree}: ${n.note}`));

console.log('\n--- Testing D Dorian (Expect b3, b7) ---');
const dDorian = calculateScale('D', 'major', 'dorian');
dDorian.forEach(n => console.log(`${n.degree}: ${n.note}`));
