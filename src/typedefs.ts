export interface SliderConfigs {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
}

export interface OrganismConfigs {
    scene: Phaser.Scene,
    texture?: string,
    velocity?: number,
    size?: number,
    x?: number,
    y?: number,
    frame?: string | number,
}
