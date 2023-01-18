export interface SliderConfigs {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
}

export interface OrganismConfigs {
    scene: Phaser.Scene,
    velocity?: number,
    size?: number,
    x?: number,
    y?: number,
    color?: number,
}

export interface FoodConfigs {
    scene: Phaser.Scene,
    x?: number,
    y?: number,
    color?: number,
}
