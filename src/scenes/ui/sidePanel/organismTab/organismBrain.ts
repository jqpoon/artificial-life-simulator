import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle';
import { UIComponent } from '../../common/UIComponent';
import { UIScene } from '../../mainUI';
import { smallerTextDark } from '../../common/UIConstants';
import assert from 'assert';

export class OrganismBrain extends UIComponent {
  private circles: Phaser.GameObjects.Arc[];
  private arrows: Phaser.GameObjects.Image[];
  private centerText: Phaser.GameObjects.Text;

  constructor(scene: UIScene) {
    super(scene);
    this.circles = [];
    this.arrows = [];

    // Background of information pane
    let background = new RoundRectangle(scene, {
      radius: 10,
      color: 0xe9e9ed,
      strokeColor: 0x8f8f9c,
    }).setDepth(-1);
    scene.add.existing(background);

    /* Use an internal overlap sizer to arrange in a circular fashion */
    let sizer = scene.rexUI.add.overlapSizer({ width: 300, height: 300 });

    let top = this.createDirectionInfographic(scene, 0xff0000, 0, 0);
    let topRight = this.createDirectionInfographic(scene, 0xff0000, 45, 45);
    let right = this.createDirectionInfographic(scene, 0xff0000, 90, 90);
    let bottomRight = this.createDirectionInfographic(
      scene,
      0xff0000,
      135,
      135
    );
    let bottom = this.createDirectionInfographic(scene, 0xff0000, 180, 180);
    let bottomLeft = this.createDirectionInfographic(scene, 0xff0000, 225, 225);
    let left = this.createDirectionInfographic(scene, 0xff0000, 270, 270);
    let topLeft = this.createDirectionInfographic(scene, 0xff0000, 315, 315);

    this.centerText = scene.add.text(0, 0, 'Organism\nType', smallerTextDark);

    sizer
      .add(this.centerText, { expand: false })
      .add(top, { align: 'top', expand: false, padding: 20 })
      .add(topRight, { align: 'right-top', expand: false, padding: 30 })
      .add(right, { align: 'right', expand: false, padding: 20 })
      .add(bottomRight, { align: 'right-bottom', expand: false, padding: 30 })
      .add(bottom, { align: 'bottom', expand: false, padding: 20 })
      .add(bottomLeft, { align: 'left-bottom', expand: false, padding: 30 })
      .add(left, { align: 'left', expand: false, padding: 20 })
      .add(topLeft, { align: 'left-top', expand: false, padding: 30 });

    this.add(sizer);
    this.addBackground(background);
  }

  public reset(): void {
    this.setOrganismColor(0xff0000);
    this.setCenterText('Organism\nType');
    this.setArrowDirection([0, 0, 0, 0, 0, 0, 0, 0]);
  }

  public setOrganismColor(color: number, alpha: number = 1): void {
    this.circles.map((circle: Phaser.GameObjects.Arc) => {
      circle.setFillStyle(color, alpha);
    });
  }

  public setCenterText(text: string): void {
    this.centerText.setText(text);
  }

  public setArrowDirection(directionsInDegrees: number[]) {
    /* If none are provided, we just hide the arrows */
    if (directionsInDegrees.length === 0) {
      this.arrows.map((arrow: Phaser.GameObjects.Image) => {arrow.setAlpha(0)});
      return;
    }

    assert(directionsInDegrees.length === 8, 'Invalid number of directions passed to setArrowDirection()');

    for (let [idx, direction] of Object.entries(directionsInDegrees)) {
      this.arrows[parseInt(idx)].setRotation(Phaser.Math.DegToRad(direction));
      this.arrows[parseInt(idx)].setAlpha(1);
    }
  }

  private createDirectionInfographic(
    scene: UIScene,
    color: number,
    arrowDirectionInDegrees: number,
    foodDirectionInDegrees: number
  ) {
    let arrow = scene.add
      .image(0, 0, 'arrow')
      .setScale(0.3)
      .setOrigin(0.5, 1)
      .setRotation(Phaser.Math.DegToRad(arrowDirectionInDegrees));

    let organism = scene.add
      .circle(0, 0, 15, color)
      .setStrokeStyle(1, 0x000000);

    this.arrows.push(arrow);
    this.circles.push(organism);

    let food = scene.add.circle(0, 0, 5, 0x6cbf65);
    let foodOffset = Phaser.Math.RotateTo(
      { x: 0, y: 0 },
      0,
      0,
      Phaser.Math.DegToRad(foodDirectionInDegrees - 90), // Phaser has 0 = facing right
      40
    );
    let foodX = foodOffset.x;
    let foodY = foodOffset.y;

    let overlapSizer = scene.rexUI.add
      .overlapSizer({ height: 80, width: 80 })
      .add(arrow, { align: 'center', expand: false, offsetY: -15 })
      .add(organism, { align: 'center', expand: false })
      .add(food, {
        align: 'center',
        expand: false,
        offsetX: foodX,
        offsetY: foodY,
      });

    return overlapSizer;
  }
}
