export class PrimeNGObject {
    name: string;
    value: string;
}

export class ResponsiveCarouselOptions {
    breakpoint: string;
    numVisible: number;
    numScroll: number;
}

export class CarouselHomeObject {
    title: string;
    img: string;
    body: string;
    value: number;
    route?: string;
    hidden: 'hidden' | '';
    classes: string;
}