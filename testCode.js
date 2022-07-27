// require ('test');
// eval ("require('x.js')");

let a = 1;

do ; while (a++ < 3);
do {} while (a++ < 3);
do a++; while (a++ < 3);
do {a = a;} while (a++ < 3);
for (;;);
for (;;) {}
for (;;) a = a;
for (;;) { a = a }
while (a++ < 5);
while (a++ < 5) {}
while (a++ < 5) a = a;
while (a++ < 5) {a = a;}

a = a + 5 * 2;

a = a * 10;

a = a / 2;

a = a - 1;

a = a + 1 % 9;

function f() {
  f1();
}

function f1() {
  f();
}


f();
f();

if (a === 1) {
    a = a * 8;
}

if (a === 1 * 3) {
    a = a * 8;
}
