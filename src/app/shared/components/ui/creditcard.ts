import { afterNextRender, Component, computed, effect, inject, input, output, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LayoutService } from '../../../layout/service/layout.service';

export interface CardConfig {
    primary: string;
}

@Component({
    selector: '[credit-card]',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="flex flex-col h-full w-full justify-between">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-1 -ml-4">
                    <div class="h-7 w-auto">
                        <svg class="h-12 w-auto" xmlns="http://www.w3.org/2000/svg" width="42" height="43" viewBox="0 0 42 43" fill="none">
                            <foreignObject x="-6.09015" y="-15.6866" width="50.0996" height="58.5969">
                                <div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter: blur(10.24px); clip-path: url(#bgblur_0_clip_path); height: 100%; width: 100%"></div>
                            </foreignObject>
                            <g filter="url(#filter0_card)">
                                <path
                                    d="M23.5255 4.7973C22.3263 4.7973 21.1389 5.02529 20.031 5.46826C18.9231 5.91123 17.9164 6.5605 17.0684 7.379C16.2205 8.1975 15.5478 9.1692 15.0889 10.2386C14.63 11.308 14.3938 12.4542 14.3938 13.6118C14.3938 14.7693 14.63 15.9155 15.0889 16.9849C15.5478 18.0544 16.2205 19.0261 17.0684 19.8446C17.9164 20.6631 18.9231 21.3123 20.031 21.7553C21.1389 22.1983 22.3263 22.4263 23.5255 22.4263L23.5255 4.7973Z"
                                    fill="url(#paint0_linear_card)"
                                    fill-opacity="0.9"
                                    shape-rendering="crispEdges"
                                />
                            </g>
                            <foreignObject x="3.28888" y="-19.038" width="50.0996" height="58.5969">
                                <div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter: blur(10.24px); clip-path: url(#bgblur_1_clip_path); height: 100%; width: 100%"></div>
                            </foreignObject>
                            <g filter="url(#filter1_card)">
                                <path
                                    d="M23.7728 19.0749C24.972 19.0749 26.1595 18.8469 27.2674 18.4039C28.3753 17.961 29.382 17.3117 30.2299 16.4932C31.0779 15.6747 31.7505 14.703 32.2095 13.6336C32.6684 12.5642 32.9046 11.418 32.9046 10.2604C32.9046 9.10289 32.6684 7.95669 32.2095 6.88727C31.7505 5.81784 31.0779 4.84614 30.2299 4.02764C29.382 3.20914 28.3753 2.55987 27.2674 2.1169C26.1595 1.67393 24.972 1.44594 23.7728 1.44594L23.7728 19.0749Z"
                                    fill="url(#paint1_linear_card)"
                                    fill-opacity="0.9"
                                    shape-rendering="crispEdges"
                                />
                            </g>
                            <defs>
                                <filter id="filter0_card" x="-6.09015" y="-15.6866" width="50.0996" height="58.5969" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="0.1707" />
                                    <feGaussianBlur stdDeviation="0.1707" />
                                    <feComposite in2="hardAlpha" operator="out" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                                    <feBlend mode="color-burn" in2="BackgroundImageFix" result="effect1" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1" result="shape" />
                                </filter>
                                <filter id="filter1_card" x="3.28888" y="-19.038" width="50.0996" height="58.5969" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="0.1707" />
                                    <feGaussianBlur stdDeviation="0.1707" />
                                    <feComposite in2="hardAlpha" operator="out" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                                    <feBlend mode="color-burn" in2="BackgroundImageFix" result="effect1" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1" result="shape" />
                                </filter>
                                <clipPath id="bgblur_0_clip_path" transform="translate(6.09015 15.6866)">
                                    <path
                                        d="M23.5255 4.7973C22.3263 4.7973 21.1389 5.02529 20.031 5.46826C18.9231 5.91123 17.9164 6.5605 17.0684 7.379C16.2205 8.1975 15.5478 9.1692 15.0889 10.2386C14.63 11.308 14.3938 12.4542 14.3938 13.6118C14.3938 14.7693 14.63 15.9155 15.0889 16.9849C15.5478 18.0544 16.2205 19.0261 17.0684 19.8446C17.9164 20.6631 18.9231 21.3123 20.031 21.7553C21.1389 22.1983 22.3263 22.4263 23.5255 22.4263L23.5255 4.7973Z"
                                    />
                                </clipPath>
                                <clipPath id="bgblur_1_clip_path" transform="translate(-3.28888 19.038)">
                                    <path
                                        d="M23.7728 19.0749C24.972 19.0749 26.1595 18.8469 27.2674 18.4039C28.3753 17.961 29.382 17.3117 30.2299 16.4932C31.0779 15.6747 31.7505 14.703 32.2095 13.6336C32.6684 12.5642 32.9046 11.418 32.9046 10.2604C32.9046 9.10289 32.6684 7.95669 32.2095 6.88727C31.7505 5.81784 31.0779 4.84614 30.2299 4.02764C29.382 3.20914 28.3753 2.55987 27.2674 2.1169C26.1595 1.67393 24.972 1.44594 23.7728 1.44594L23.7728 19.0749Z"
                                    />
                                </clipPath>
                                <linearGradient id="paint0_linear_card" x1="12.8768" y1="1.7197" x2="27.1672" y2="8.7639" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="white" stop-opacity="0.92" />
                                    <stop offset="1" stop-color="white" stop-opacity="0.64" />
                                </linearGradient>
                                <linearGradient id="paint1_linear_card" x1="34.4216" y1="22.1525" x2="20.1312" y2="15.1083" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="white" stop-opacity="0.92" />
                                    <stop offset="1" stop-color="white" stop-opacity="0.64" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <span class="font-medium text-surface-0 leading-none text-lg">Avalon</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-auto" viewBox="0 0 12 16" fill="none">
                    <path
                        d="M3.80217 12.5832C3.66881 12.5836 3.53867 12.541 3.43014 12.4613C3.36003 12.4113 3.30022 12.3475 3.2541 12.2737C3.20799 12.1998 3.1765 12.1174 3.16141 12.0311C3.14633 11.9447 3.14795 11.8562 3.16618 11.7705C3.18442 11.6848 3.21891 11.6036 3.26769 11.5316C4.02349 10.4224 4.42889 9.10105 4.42889 7.74699C4.42889 6.39292 4.02349 5.07162 3.26769 3.96234C3.21526 3.89084 3.17736 3.80925 3.15625 3.72241C3.13513 3.63557 3.13123 3.54524 3.14478 3.45682C3.15832 3.3684 3.18903 3.28367 3.23509 3.20769C3.28114 3.1317 3.34159 3.06601 3.41285 3.01451C3.48411 2.96301 3.56473 2.92677 3.6499 2.90792C3.73507 2.88908 3.82306 2.88802 3.90863 2.90482C3.99421 2.92162 4.07563 2.95592 4.14804 3.0057C4.22046 3.05547 4.28238 3.1197 4.33015 3.19456C5.23975 4.52869 5.72768 6.1181 5.72768 7.74699C5.72768 9.37587 5.23975 10.9653 4.33015 12.2994C4.27055 12.3866 4.19152 12.4578 4.09968 12.5071C4.00783 12.5565 3.90582 12.5826 3.80217 12.5832Z"
                        fill="white"
                    />
                    <path
                        d="M1.2286 10.9391C1.09481 10.939 0.964327 10.8965 0.854956 10.8173C0.784847 10.7672 0.725028 10.7035 0.678917 10.6296C0.632805 10.5558 0.601304 10.4734 0.586217 10.387C0.57113 10.3007 0.57275 10.2121 0.590986 10.1265C0.609223 10.0408 0.64372 9.9596 0.692501 9.88761C1.11984 9.26013 1.34905 8.51283 1.34905 7.747C1.34905 6.98117 1.11984 6.23387 0.692501 5.6064C0.593404 5.46143 0.55442 5.28195 0.584125 5.10744C0.613829 4.93294 0.709785 4.7777 0.850891 4.67589C0.991996 4.57407 1.16669 4.53402 1.33654 4.56454C1.50639 4.59506 1.65748 4.69365 1.75658 4.83862C2.33706 5.69121 2.64839 6.70653 2.64839 7.747C2.64839 8.78747 2.33706 9.8028 1.75658 10.6554C1.69698 10.7425 1.61796 10.8137 1.52611 10.8631C1.43427 10.9125 1.33225 10.9385 1.2286 10.9391Z"
                        fill="white"
                    />
                    <path
                        d="M6.37706 13.9886C6.25812 13.9885 6.14149 13.9549 6.03986 13.8914C5.93824 13.8279 5.85552 13.737 5.80073 13.6285C5.74594 13.52 5.72117 13.3982 5.72912 13.2763C5.73707 13.1544 5.77745 13.037 5.84584 12.937C6.88234 11.4159 7.4383 9.60391 7.4383 7.74702C7.4383 5.89013 6.88234 4.07818 5.84584 2.557C5.7917 2.48563 5.75223 2.40369 5.72986 2.31617C5.70749 2.22865 5.70267 2.13737 5.7157 2.04788C5.72872 1.95839 5.75931 1.87255 5.80562 1.79557C5.85193 1.7186 5.91299 1.65211 5.98508 1.60012C6.05717 1.54814 6.13878 1.51176 6.22498 1.49318C6.31118 1.47461 6.40016 1.47423 6.4865 1.49207C6.57285 1.50991 6.65476 1.5456 6.72727 1.59697C6.79978 1.64834 6.86135 1.71432 6.90828 1.79089C8.09867 3.53657 8.73725 5.61638 8.73725 7.74786C8.73725 9.87933 8.09867 11.9591 6.90828 13.7048C6.84836 13.7924 6.76883 13.8639 6.67637 13.9133C6.58392 13.9627 6.48126 13.9885 6.37706 13.9886Z"
                        fill="white"
                    />
                    <path
                        d="M8.95017 15.4122C8.83137 15.4118 8.71495 15.378 8.61356 15.3144C8.51217 15.2508 8.42969 15.1598 8.37509 15.0514C8.32049 14.943 8.29586 14.8213 8.30388 14.6995C8.3119 14.5778 8.35225 14.4606 8.42056 14.3607C9.74104 12.4221 10.4493 10.1131 10.4493 7.74695C10.4493 5.38077 9.74104 3.07183 8.42056 1.1332C8.36814 1.06171 8.33023 0.980117 8.30911 0.893273C8.288 0.80643 8.28411 0.716112 8.29765 0.627688C8.31119 0.539264 8.34191 0.45454 8.38796 0.378555C8.43401 0.302571 8.49446 0.236876 8.56572 0.185379C8.63699 0.133882 8.71759 0.0976334 8.80276 0.0787893C8.88794 0.0599452 8.97592 0.0588905 9.0615 0.0756873C9.14707 0.092484 9.22851 0.12679 9.30092 0.176564C9.37333 0.226339 9.43526 0.290564 9.48302 0.365424C10.9573 2.52889 11.7481 5.10595 11.7481 7.74695C11.7481 10.388 10.9573 12.965 9.48302 15.1285C9.42295 15.2163 9.34315 15.288 9.25039 15.3373C9.15763 15.3867 9.05465 15.4124 8.95017 15.4122Z"
                        fill="white"
                    />
                </svg>
            </div>
            <div>
                <div class="flex items-center gap-3.5">
                    @for (_ of [0, 1, 2]; track $index) {
                        <div class="flex items-center gap-0.5">
                            @for (_ of [0, 1, 2, 3]; track $index) {
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-auto" viewBox="0 0 8 7" fill="none">
                                    <path
                                        d="M3.75553 6.99166H4.13745C4.2011 6.60065 4.37387 6.17327 4.66485 5.70952C5.24681 4.79111 6.41983 3.89089 7.42918 3.68175V3.29983C6.92905 3.19071 6.43802 2.96338 5.96517 2.62694C5.0013 1.94495 4.29203 0.926513 4.13745 0.00810242L3.75553 0.00810242C3.6646 0.49004 3.45546 0.953792 3.1281 1.42664C2.48249 2.36323 1.47315 3.05432 0.445618 3.29983L0.445618 3.68175C0.963929 3.79086 1.49133 4.04547 2.00964 4.43648C3.06445 5.22758 3.61914 6.20965 3.75553 6.99166Z"
                                        fill="white"
                                    />
                                </svg>
                            }
                        </div>
                    }
                    <span class="text-surface-0">{{ cardNumber() }}</span>
                </div>
                <div class="mt-2 font-medium text-surface-0 text-lg">{{ cardHolderName() }}</div>
            </div>
        </div>
        <!-- Background pattern SVG -->
        <svg class="absolute w-[40rem] h-auto -top-[25%] -left-[20%] mix-blend-overlay pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="324" height="182" viewBox="0 0 324 182" fill="none">
            <path
                d="M221.737 306.837L223.927 303.402M221.737 306.835L220.298 306.221M221.737 306.835L209.697 314.462"
                stroke="url(#paint_bg_pattern)"
                stroke-opacity="0.2"
                stroke-width="0.925532"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <defs>
                <linearGradient id="paint_bg_pattern" x1="60.1908" y1="31.0052" x2="205.037" y2="128.649" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white" />
                    <stop offset="0.892787" stop-color="white" stop-opacity="0" />
                </linearGradient>
            </defs>
        </svg>
        <!-- Navigation buttons -->
        <div class="absolute bottom-0 right-0 rounded-tl-3xl bg-white/10 border-t border-l border-white/30 flex items-center gap-3 px-4 py-1.5 backdrop-blur-sm">
            <button [disabled]="disabled()" (click)="onPreviousCard()" class="text-surface-0 disabled:opacity-50">
                <i class="pi pi-arrow-left text-sm!"></i>
            </button>
            <span class="w-px h-3 bg-white/70"></span>
            <button [disabled]="disabled()" (click)="onNextCard()" class="text-surface-0 disabled:opacity-50">
                <i class="pi pi-arrow-right text-sm!"></i>
            </button>
        </div>
        <!-- Right decoration SVG -->
        <svg class="h-full w-auto absolute right-0 top-0 pointer-events-none" width="197" height="182" viewBox="0 0 197 182" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter_right_0)">
                <path
                    d="M108.717 60.1681C98.5982 71.2276 90.6812 84.1025 85.418 98.0579C80.1548 112.013 77.6484 126.776 78.042 141.502C78.4355 156.229 81.7213 170.631 87.7117 183.887C93.7021 197.143 102.28 208.993 112.955 218.76C123.63 228.527 136.194 236.02 149.929 240.812C163.664 245.603 178.301 247.599 193.004 246.685C207.708 245.771 222.19 241.966 235.623 235.486C249.057 229.006 261.179 219.978 271.298 208.919L108.717 60.1681Z"
                    fill="url(#paint_right_0)"
                    fill-opacity="0.9"
                    shape-rendering="crispEdges"
                />
            </g>
            <g filter="url(#filter_right_1)">
                <path
                    d="M242.474 178.362C252.593 167.302 260.51 154.427 265.773 140.472C271.036 126.516 273.543 111.754 273.149 97.0274C272.756 82.3008 269.47 67.8983 263.479 54.6424C257.489 41.3865 248.911 29.5367 238.236 19.7696C227.561 10.0025 214.997 2.5093 201.262 -2.28207C187.527 -7.07344 172.89 -9.06919 158.187 -8.15537C143.483 -7.24154 129.001 -3.43604 115.568 3.04387C102.134 9.52377 90.0117 18.5512 79.893 29.6106L242.474 178.362Z"
                    fill="url(#paint_right_1)"
                    fill-opacity="0.9"
                    shape-rendering="crispEdges"
                />
            </g>
            <defs>
                <filter id="filter_right_0" x="12.4532" y="38.3186" width="324.393" height="317.83" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.546239" />
                    <feGaussianBlur stdDeviation="0.546239" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                    <feBlend mode="color-burn" in2="BackgroundImageFix" result="effect1" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1" result="shape" />
                </filter>
                <filter id="filter_right_1" x="14.3444" y="-30.2206" width="324.393" height="317.83" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.546239" />
                    <feGaussianBlur stdDeviation="0.546239" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                    <feBlend mode="color-burn" in2="BackgroundImageFix" result="effect1" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1" result="shape" />
                </filter>
                <linearGradient id="paint_right_0" x1="-9.51907" y1="132.407" x2="176.026" y2="60.0534" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white" stop-opacity="0.92" />
                    <stop offset="1" stop-color="white" stop-opacity="0.64" />
                </linearGradient>
                <linearGradient id="paint_right_1" x1="360.71" y1="106.123" x2="175.165" y2="178.476" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white" stop-opacity="0.92" />
                    <stop offset="1" stop-color="white" stop-opacity="0.64" />
                </linearGradient>
            </defs>
        </svg>
    `,
    host: {
        '[class]': 'styleClass()',
        '[style.backgroundBlendMode]': '"multiply, normal"',
        '[style.background]': 'backgroundStyle()'
    }
})
export class CreditCard {
    private platformId = inject(PLATFORM_ID);
    private layoutService = inject<any>(LayoutService);

    // Inputs
    styleClass = input<string>('');
    cardNumber = input.required<string>();
    cardHolderName = input.required<string>();
    color = input<[string, string]>(['primary-500', 'primary-400']);
    disabled = input<boolean>(false);

    // Outputs
    nextCard = output<void>();
    previousCard = output<void>();

    // Internal state
    private bgColor = signal<[string, string]>(['', '']);

    backgroundStyle = computed(() => {
        const colors = this.bgColor();
        return `linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(85, 85, 85, 0.08) 100%), linear-gradient(180deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
    });

    constructor() {
        // Watch for color/theme changes
        effect(() => {
            const _ = this.layoutService.layoutConfig().primary;
            const colorInput = this.color();
            this.updateBgColor(colorInput);
        });
    }

    private updateBgColor(colorInput: [string, string]) {
        if (isPlatformBrowser(this.platformId)) {
            const color1 = this.getColor(colorInput[0]);
            const color2 = this.getColor(colorInput[1]);
            this.bgColor.set([color1, color2]);
        }
    }

    private getColor(color: string, opacity: number = 1): string {
        if (!isPlatformBrowser(this.platformId)) {
            return '';
        }

        const rootStyles = getComputedStyle(document.documentElement);
        let calculatedColor = rootStyles.getPropertyValue(`--p-${color ?? 'primary-400'}`).trim();

        // If not found, try without -500 suffix for base colors like 'primary'
        if (!calculatedColor && !color.includes('-')) {
            calculatedColor = rootStyles.getPropertyValue(`--p-${color}-500`).trim();
        }

        if (!calculatedColor) {
            return `rgba(0, 0, 0, ${opacity})`;
        }

        // Handle light-dark() CSS function
        if (calculatedColor.startsWith('light-dark(')) {
            const matches = calculatedColor.match(/light-dark\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/);
            if (matches) {
                const isDark = document.documentElement.classList.contains('p-dark');
                calculatedColor = isDark ? matches[2].trim() : matches[1].trim();
            }
        }

        // Handle oklch colors
        if (calculatedColor.startsWith('oklch(')) {
            return calculatedColor;
        }

        if (calculatedColor.includes('rgba')) {
            return calculatedColor.replace(/[\d.]+\)$/g, `${opacity})`);
        } else if (calculatedColor.includes('rgb')) {
            return calculatedColor.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
        } else {
            const hex = calculatedColor.trim();
            if (hex.startsWith('#') && hex.length >= 7) {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
            }
            return calculatedColor;
        }
    }

    onNextCard() {
        this.nextCard.emit();
    }

    onPreviousCard() {
        this.previousCard.emit();
    }
}
