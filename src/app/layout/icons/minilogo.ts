import { Component, input } from '@angular/core';

@Component({
    selector: 'mini-logo',
    standalone: true,
    template: `
        <svg [class]="styleClass()" xmlns="http://www.w3.org/2000/svg" width="32" height="31" viewBox="0 0 32 31" fill="none">
            <g filter="url(#filter0_ddddddi_6346_12099)">
                <g clip-path="url(#clip0_6346_12099)">
                    <rect x="2" y="0.5" width="28" height="28" rx="7.28" fill="url(#paint0_linear_6346_12099)" />
                    <rect x="2" y="0.5" width="28" height="28" rx="7.28" fill="url(#paint1_linear_6346_12099)" fill-opacity="0.08" style="mix-blend-mode: plus-darker" />
                    <g filter="url(#filter1_dddddddd_6346_12099)">
                        <path
                            d="M15.9065 8.93405C14.9996 8.93405 14.1015 9.11269 13.2635 9.45978C12.4256 9.80687 11.6642 10.3156 11.0229 10.9569C10.3815 11.5983 9.87281 12.3596 9.52573 13.1976C9.17864 14.0355 9 14.9336 9 15.8406C9 16.7476 9.17864 17.6457 9.52573 18.4836C9.87282 19.3216 10.3815 20.0829 11.0229 20.7243C11.6642 21.3656 12.4256 21.8743 13.2635 22.2214C14.1015 22.5685 14.9996 22.7471 15.9065 22.7471L15.9065 8.93405Z"
                            fill="url(#paint2_linear_6346_12099)"
                            fill-opacity="0.9"
                            shape-rendering="crispEdges"
                        />
                    </g>
                    <g filter="url(#filter2_dddddddd_6346_12099)">
                        <path
                            d="M16.0935 20.123C17.0004 20.123 17.8985 19.9444 18.7365 19.5973C19.5744 19.2502 20.3358 18.7415 20.9771 18.1002C21.6185 17.4588 22.1272 16.6975 22.4743 15.8595C22.8214 15.0216 23 14.1235 23 13.2165C23 12.3095 22.8214 11.4114 22.4743 10.5735C22.1272 9.73555 21.6185 8.97418 20.9771 8.33285C20.3358 7.69151 19.5744 7.18278 18.7365 6.8357C17.8985 6.48861 17.0004 6.30997 16.0935 6.30997L16.0935 20.123Z"
                            fill="url(#paint3_linear_6346_12099)"
                            fill-opacity="0.9"
                            shape-rendering="crispEdges"
                        />
                    </g>
                </g>
            </g>
            <defs>
                <filter id="filter0_ddddddi_6346_12099" x="0.90625" y="0.390625" width="30.1875" height="30.5156" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.0546875" />
                    <feGaussianBlur stdDeviation="0.0546875" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feMorphology radius="0.0546875" operator="erode" in="SourceAlpha" result="effect2_dropShadow_6346_12099" />
                    <feOffset dy="0.109375" />
                    <feGaussianBlur stdDeviation="0.109375" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.0156863 0 0 0 0 0.0313726 0 0 0 0 0.129412 0 0 0 0.12 0" />
                    <feBlend mode="normal" in2="effect1_dropShadow_6346_12099" result="effect2_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feMorphology radius="0.109375" operator="erode" in="SourceAlpha" result="effect3_dropShadow_6346_12099" />
                    <feOffset dy="0.21875" />
                    <feGaussianBlur stdDeviation="0.21875" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.0156863 0 0 0 0 0.0313726 0 0 0 0 0.129412 0 0 0 0.12 0" />
                    <feBlend mode="normal" in2="effect2_dropShadow_6346_12099" result="effect3_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feMorphology radius="0.21875" operator="erode" in="SourceAlpha" result="effect4_dropShadow_6346_12099" />
                    <feOffset dy="0.4375" />
                    <feGaussianBlur stdDeviation="0.328125" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.0156863 0 0 0 0 0.0313726 0 0 0 0 0.129412 0 0 0 0.12 0" />
                    <feBlend mode="normal" in2="effect3_dropShadow_6346_12099" result="effect4_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feMorphology radius="0.4375" operator="erode" in="SourceAlpha" result="effect5_dropShadow_6346_12099" />
                    <feOffset dy="0.875" />
                    <feGaussianBlur stdDeviation="0.65625" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.0156863 0 0 0 0 0.0313726 0 0 0 0 0.129412 0 0 0 0.12 0" />
                    <feBlend mode="normal" in2="effect4_dropShadow_6346_12099" result="effect5_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feMorphology radius="0.65625" operator="erode" in="SourceAlpha" result="effect6_dropShadow_6346_12099" />
                    <feOffset dy="1.3125" />
                    <feGaussianBlur stdDeviation="0.875" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.0167722 0 0 0 0 0.0301219 0 0 0 0 0.128019 0 0 0 0.06 0" />
                    <feBlend mode="normal" in2="effect5_dropShadow_6346_12099" result="effect6_dropShadow_6346_12099" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect6_dropShadow_6346_12099" result="shape" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.4375" />
                    <feGaussianBlur stdDeviation="0.21875" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0" />
                    <feBlend mode="normal" in2="shape" result="effect7_innerShadow_6346_12099" />
                </filter>
                <filter id="filter1_dddddddd_6346_12099" x="5.78079" y="7.86098" width="13.3447" height="20.2515" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.0268268" />
                    <feGaussianBlur stdDeviation="0.0268268" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                    <feBlend mode="color-burn" in2="BackgroundImageFix" result="effect1_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.0536536" />
                    <feGaussianBlur stdDeviation="0.0402402" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
                    <feBlend mode="color-burn" in2="effect1_dropShadow_6346_12099" result="effect2_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.107307" />
                    <feGaussianBlur stdDeviation="0.107307" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
                    <feBlend mode="color-burn" in2="effect2_dropShadow_6346_12099" result="effect3_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.214614" />
                    <feGaussianBlur stdDeviation="0.160961" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                    <feBlend mode="color-burn" in2="effect3_dropShadow_6346_12099" result="effect4_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.429229" />
                    <feGaussianBlur stdDeviation="0.321921" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                    <feBlend mode="color-burn" in2="effect4_dropShadow_6346_12099" result="effect5_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.643843" />
                    <feGaussianBlur stdDeviation="0.429229" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
                    <feBlend mode="color-burn" in2="effect5_dropShadow_6346_12099" result="effect6_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="-0.429229" dy="1.5023" />
                    <feGaussianBlur stdDeviation="0.858457" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                    <feBlend mode="plus-darker" in2="effect6_dropShadow_6346_12099" result="effect7_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="2.14614" />
                    <feGaussianBlur stdDeviation="1.60961" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                    <feBlend mode="plus-darker" in2="effect7_dropShadow_6346_12099" result="effect8_dropShadow_6346_12099" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect8_dropShadow_6346_12099" result="shape" />
                </filter>
                <filter id="filter2_dddddddd_6346_12099" x="12.8745" y="5.2369" width="13.3447" height="20.2515" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.0268268" />
                    <feGaussianBlur stdDeviation="0.0268268" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                    <feBlend mode="color-burn" in2="BackgroundImageFix" result="effect1_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.0536536" />
                    <feGaussianBlur stdDeviation="0.0402402" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
                    <feBlend mode="color-burn" in2="effect1_dropShadow_6346_12099" result="effect2_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.107307" />
                    <feGaussianBlur stdDeviation="0.107307" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
                    <feBlend mode="color-burn" in2="effect2_dropShadow_6346_12099" result="effect3_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.214614" />
                    <feGaussianBlur stdDeviation="0.160961" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                    <feBlend mode="color-burn" in2="effect3_dropShadow_6346_12099" result="effect4_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.429229" />
                    <feGaussianBlur stdDeviation="0.321921" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                    <feBlend mode="color-burn" in2="effect4_dropShadow_6346_12099" result="effect5_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="0.643843" />
                    <feGaussianBlur stdDeviation="0.429229" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
                    <feBlend mode="color-burn" in2="effect5_dropShadow_6346_12099" result="effect6_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="-0.429229" dy="1.5023" />
                    <feGaussianBlur stdDeviation="0.858457" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                    <feBlend mode="plus-darker" in2="effect6_dropShadow_6346_12099" result="effect7_dropShadow_6346_12099" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="2.14614" />
                    <feGaussianBlur stdDeviation="1.60961" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                    <feBlend mode="plus-darker" in2="effect7_dropShadow_6346_12099" result="effect8_dropShadow_6346_12099" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect8_dropShadow_6346_12099" result="shape" />
                </filter>
                <linearGradient id="paint0_linear_6346_12099" x1="2" y1="0.5" x2="2" y2="28.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#52C5FF" />
                    <stop offset="1" stop-color="#0468FF" />
                </linearGradient>
                <linearGradient id="paint1_linear_6346_12099" x1="16" y1="0.5" x2="16" y2="28.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white" stop-opacity="0" />
                    <stop offset="1" stop-color="#555555" />
                </linearGradient>
                <linearGradient id="paint2_linear_6346_12099" x1="7.85262" y1="6.52262" x2="18.807" y2="11.7348" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white" stop-opacity="0.92" />
                    <stop offset="1" stop-color="white" stop-opacity="0.64" />
                </linearGradient>
                <linearGradient id="paint3_linear_6346_12099" x1="24.1474" y1="22.5345" x2="13.193" y2="17.3223" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white" stop-opacity="0.92" />
                    <stop offset="1" stop-color="white" stop-opacity="0.64" />
                </linearGradient>
                <clipPath id="clip0_6346_12099">
                    <rect x="2" y="0.5" width="28" height="28" rx="7.28" fill="white" />
                </clipPath>
            </defs>
        </svg>
    `
})
export class MiniLogo {
    styleClass = input<string>('', { alias: 'class' });
}
