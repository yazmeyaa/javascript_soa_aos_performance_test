class PositionsSoA {
    constructor(size) {
        this.x = new Float32Array(size);
        this.y = new Float32Array(size);
        this.z = new Float32Array(size);
    }
}

// -----------------------------------------------------------------------------
// CONFIG
// -----------------------------------------------------------------------------

const SIZES = {
    small: 1_000,
    medium: 100_000,
    large: 10_000_000
};

let SIZE = SIZES.large;
let ITERATIONS = 100;

// -----------------------------------------------------------------------------
// BENCH
// -----------------------------------------------------------------------------

function bench(fn) {
    fn(); // warmup

    const start = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
        fn();
    }

    const end = performance.now();

    console.log(
        `${fn.name.padEnd(28)} ${(end - start) / ITERATIONS} ms`
    );
}

// -----------------------------------------------------------------------------
// DATA
// -----------------------------------------------------------------------------

const posSoA = new PositionsSoA(SIZE);
const velSoA = new PositionsSoA(SIZE);

const posAoS = Array.from({ length: SIZE }, () => ({ x: 0, y: 0, z: 0 }));
const velAoS = Array.from({ length: SIZE }, () => ({ x: 1, y: 1, z: 1 }));

// -----------------------------------------------------------------------------
// INIT
// -----------------------------------------------------------------------------

function initSoA() {
    const px = posSoA.x, py = posSoA.y, pz = posSoA.z;
    const vx = velSoA.x, vy = velSoA.y, vz = velSoA.z;

    for (let i = 0; i < SIZE; i++) {
        px[i] = i;
        py[i] = i;
        pz[i] = i;

        vx[i] = 1;
        vy[i] = 1;
        vz[i] = 1;
    }
}

function initAoS() {
    for (let i = 0; i < SIZE; i++) {
        posAoS[i].x = i;
        posAoS[i].y = i;
        posAoS[i].z = i;

        velAoS[i].x = 1;
        velAoS[i].y = 1;
        velAoS[i].z = 1;
    }
}

initSoA();
initAoS();

// -----------------------------------------------------------------------------
// RAW SET
// -----------------------------------------------------------------------------

function testSoASet() {
    const px = posSoA.x, py = posSoA.y, pz = posSoA.z;

    for (let i = 0; i < SIZE; i++) {
        px[i] = i;
        py[i] = i;
        pz[i] = i;
    }
}

function testAoSSet() {
    for (let i = 0; i < SIZE; i++) {
        const p = posAoS[i];
        p.x = i;
        p.y = i;
        p.z = i;
    }
}

// -----------------------------------------------------------------------------
// RAW GET (stable sink)
// -----------------------------------------------------------------------------

let sink = 0;

function testSoAGet() {
    const px = posSoA.x, py = posSoA.y, pz = posSoA.z;

    let s = 0;

    for (let i = 0; i < SIZE; i++) {
        s ^= (px[i] | 0);
        s ^= (py[i] | 0);
        s ^= (pz[i] | 0);
    }

    sink = s;
}

function testAoSGet() {
    let s = 0;

    for (let i = 0; i < SIZE; i++) {
        const p = posAoS[i];
        s ^= (p.x | 0);
        s ^= (p.y | 0);
        s ^= (p.z | 0);
    }

    sink = s;
}

// -----------------------------------------------------------------------------
// MOVEMENT
// -----------------------------------------------------------------------------

function testSoAMove() {
    const px = posSoA.x, py = posSoA.y, pz = posSoA.z;
    const vx = velSoA.x, vy = velSoA.y, vz = velSoA.z;

    for (let i = 0; i < SIZE; i++) {
        px[i] += vx[i];
        py[i] += vy[i];
        pz[i] += vz[i];
    }
}

function testAoSMove() {
    for (let i = 0; i < SIZE; i++) {
        const p = posAoS[i];
        const v = velAoS[i];

        p.x += v.x;
        p.y += v.y;
        p.z += v.z;
    }
}

// -----------------------------------------------------------------------------
// X ONLY (key ECS case)
// -----------------------------------------------------------------------------

function testSoAX() {
    const px = posSoA.x;
    const vx = velSoA.x;

    for (let i = 0; i < SIZE; i++) {
        px[i] += vx[i];
    }
}

function testAoSX() {
    for (let i = 0; i < SIZE; i++) {
        posAoS[i].x += velAoS[i].x;
    }
}

// -----------------------------------------------------------------------------
// RUN
// -----------------------------------------------------------------------------

function runBenchmarks(sizeKey) {
    SIZE = SIZES[sizeKey];
    
    // Reinitialize data structures
    const posSoA_tmp = new PositionsSoA(SIZE);
    const velSoA_tmp = new PositionsSoA(SIZE);
    const posAoS_tmp = Array.from({ length: SIZE }, () => ({ x: 0, y: 0, z: 0 }));
    const velAoS_tmp = Array.from({ length: SIZE }, () => ({ x: 1, y: 1, z: 1 }));
    
    // Copy references
    Object.assign(posSoA, posSoA_tmp);
    Object.assign(velSoA, velSoA_tmp);
    posAoS.length = SIZE;
    velAoS.length = SIZE;
    for (let i = 0; i < SIZE; i++) {
        posAoS[i] = posAoS_tmp[i];
        velAoS[i] = velAoS_tmp[i];
    }
    
    initSoA();
    initAoS();
    
    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║  SIZE: ${sizeKey.toUpperCase().padEnd(32)} ║`);
    console.log(`║  Items: ${SIZE.toLocaleString().padEnd(32)} ║`);
    console.log(`╚════════════════════════════════════════╝`);
    
    console.log("\n=== SET ===");
    bench(testSoASet);
    bench(testAoSSet);

    console.log("\n=== GET ===");
    bench(testSoAGet);
    bench(testAoSGet);

    console.log("\n=== MOVE ===");
    bench(testSoAMove);
    bench(testAoSMove);

    console.log("\n=== X ONLY ===");
    bench(testSoAX);
    bench(testAoSX);
}

// Run benchmarks for all sizes
runBenchmarks("small");
runBenchmarks("medium");
runBenchmarks("large");

console.log("\nFINAL SINK:", sink);