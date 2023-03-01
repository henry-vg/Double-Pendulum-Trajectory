function setup() {
  const pendulum = new pendulumObject();

  pendulum.generate();

  if (pendulum.doSave) {
    pendulum.save();
  }

  if (pendulum.doDebug) {
    pendulum.debug();
  }
}

class pendulumObject {
  constructor() {
    this.doSave = false;
    this.doDebug = true;
    this.fileName = 'pendulum';
    this.size = 400;
    this.minDia = 1;
    this.maxDia = 5;
    this.xOff = (this.size + this.maxDia * 2) / 2;
    this.yOff = (this.size + this.maxDia * 2) / 2;
    this.interactions = 10000;
    this.decimalPlaces = 4;
    this.g = 1;
    this.length_1 = 100;
    this.length_2 = (this.size / 2) - this.length_1;
    this.mass_1 = 20;
    this.mass_2 = 1;
    this.angle_1 = PI / 2;
    this.angle_2 = PI / 2;
    this.vel_1 = 0;
    this.vel_2 = 0;
    this.acc_1 = 0;
    this.acc_2 = 0;
    this.points = [];
    this.vels = [];
    this.svg = `<svg width="${this.size}" height="${this.size}">\n`;
    this.debugOutput = `interactions: ${this.interactions}\ndecimalPlaces: ${this.decimalPlaces}\ng: ${this.g}\nlength_1: ${this.length_1}\nlength_2: ${this.length_2}\nmass_1: ${this.mass_1}\nmass_2: ${this.mass_2}\nangle_1: ${this.angle_1}\nangle_2: ${this.angle_2}\n`;
  }
  generate() {
    for (let i = 0; i < this.interactions; i++) {
      this.acc_1 = (-this.g * (2 * this.mass_1 + this.mass_2) * sin(this.angle_1) - this.mass_2 * this.g * sin(this.angle_1 - 2 * this.angle_2) - 2 * sin(this.angle_1 - this.angle_2) * this.mass_2 * (pow(this.vel_2, 2) * this.length_2 + pow(this.vel_1, 2) * this.length_1 * cos(this.angle_1 - this.angle_2))) / (this.length_1 * (2 * this.mass_1 + this.mass_2 - this.mass_2 * cos(2 * this.angle_1 - 2 * this.angle_2)));
      this.acc_2 = (2 * sin(this.angle_1 - this.angle_2) * (pow(this.vel_1, 2) * this.length_1 * (this.mass_1 + this.mass_2) + this.g * (this.mass_1 + this.mass_2) * cos(this.angle_1) + pow(this.vel_2, 2) * this.length_2 * this.mass_2 * cos(this.angle_1 - this.angle_2))) / (this.length_2 * (2 * this.mass_1 + this.mass_2 - this.mass_2 * cos(2 * this.angle_1 - 2 * this.angle_2)));

      this.vel_1 += this.acc_1;
      this.vel_2 += this.acc_2;
      this.angle_1 += this.vel_1;
      this.angle_2 += this.vel_2;

      const x1 = this.length_1 * sin(this.angle_1),
        y1 = this.length_1 * cos(this.angle_1),
        x2 = x1 + this.length_2 * sin(this.angle_2),
        y2 = y1 + this.length_2 * cos(this.angle_2);

      this.points.push(createVector(round(x2 + this.xOff, this.decimalPlaces), round(y2 + this.yOff), this.decimalPlaces));

      this.vels.push(abs(this.vel_2));
    }
    this.debugOutput += `success: ${!isNaN(this.vel_2)}`;

    createCanvas(2 * this.xOff, 2 * this.yOff);

    background(255);

    stroke(0, 50);

    for (let i = 0; i < this.points.length; i++) {
      const radius = round(map(this.vels[i], min(this.vels), max(this.vels), this.maxDia, this.minDia) / 2, this.decimalPlaces);

      this.svg += `\t<circle cx="${this.points[i].x}" cy="${this.points[i].y}" r="${radius}" fill="black" opacity="${round(50 * (100 / 255) / 100, this.decimalPlaces)}" />\n`;

      strokeWeight(radius * 2);
      point(this.points[i]);
    }

    this.svg += '</svg>';
  }
  save() {
    let writer = createWriter(`${this.fileName}.svg`);
    writer.write(this.svg);
    writer.close();
  }
  debug() {
    console.log(this.debugOutput);
  }
}