import { UIScene } from '../../mainUI';
import { TabComponent } from '../tabComponent';
import { OrganismBuilder } from './organismBuilder';
import { OrganismViewer } from './organismViewer';

export class OrganismTab extends TabComponent {
  private organismBuilder: OrganismBuilder;
  private organismViewer: OrganismViewer;

  constructor(scene: UIScene) {
    super(scene, {
      height: 500,
      width: 650,
      orientation: 'y',
      space: { top: 20, bottom: 20, item: 30 },
    });

    this.organismBuilder = new OrganismBuilder(scene);
    this.organismViewer = new OrganismViewer(scene);

    this.add(
      scene.rexUI.add
        .sizer({ orientation: 'x', space: { item: 20 } })
        .add(this.organismBuilder)
        .add(this.organismViewer)
    )
      .layout()
      .setDepth(1);
  }

  reset(): void {
    this.organismBuilder.reset();
    this.organismViewer.reset();
  }
}
