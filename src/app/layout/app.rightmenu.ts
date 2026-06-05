import { Component, computed, inject, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Drawer } from 'primeng/drawer';
import { Avatar } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { FileUpload, FileSelectEvent } from 'primeng/fileupload';
import { Badge } from 'primeng/badge';
import { PrimeNG } from 'primeng/config';
import { LayoutService } from './service/layout.service';
import { MiniLogo } from './icons';

interface PricingModel {
    name: string;
    code: string;
}

interface TaxCategory {
    name: string;
    code: string;
}

@Component({
    selector: '[app-rightmenu]',
    standalone: true,
    imports: [CommonModule, FormsModule, Drawer, Avatar, ButtonModule, InputTextModule, Select, InputNumber, FileUpload, Badge, MiniLogo],
    template: `
        <p-drawer [(visible)]="rightMenuVisible" position="right" class="!w-full md:!w-80 lg:!w-[30rem]" appendTo="body">
            <ng-template #headless let-closeCallback="closeCallback">
                <div class="h-full overflow-auto">
                    <div class="px-6 py-5 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <mini-logo />
                            <p-avatar image="/demo/images/avatar/avatar-square-m-1.jpg" styleClass="!w-8 !h-8 !rounded-md !overflow-hidden" />
                            <span class="font-medium">Aaron Swartz</span>
                        </div>
                        <p-button type="button" (click)="closeCallback($event)" icon="pi pi-times" [text]="true" severity="secondary" />
                    </div>
                    <div [class]="separatorClass">
                        <span>General</span>
                    </div>
                    <div class="p-6 space-y-8">
                        <div>
                            <input type="text" pInputText placeholder="Name" class="w-full" />
                            <div class="text-sm text-surface-500 mt-2">
                                <div>Give your product a short and clear name.</div>
                                <div>50-60 characters is the recommended length for search engines.</div>
                            </div>
                        </div>
                        <div>
                            <input type="text" pInputText placeholder="Description" class="w-full" />
                            <div class="text-sm text-surface-500 mt-2">
                                <div>Give your product a short and clear name.</div>
                                <div>140-160 characters is the recommended length for search engines.</div>
                            </div>
                        </div>
                    </div>
                    <div [class]="separatorClass">
                        <span>Pricing</span>
                    </div>
                    <div class="p-6 space-y-6">
                        <p-select [(ngModel)]="selectedPricingModel" [options]="pricingModels" optionLabel="name" placeholder="Pricing Model" styleClass="w-full" />
                        <p-inputnumber [(ngModel)]="priceValue" inputId="currency-us" mode="currency" currency="USD" locale="en-US" [fluid]="true" />
                        <p-select [(ngModel)]="selectedTaxCategory" [options]="taxCategories" optionLabel="name" placeholder="Tax Category" styleClass="w-full" />
                    </div>
                    <div [class]="separatorClass">
                        <span>Media</span>
                    </div>
                    <div class="p-6">
                        <p-fileupload name="demo[]" url="/api/upload" [multiple]="true" accept="image/*" [maxFileSize]="1000000" (onSelect)="onSelectedFiles($event)">
                            <ng-template #header let-files="files" let-chooseCallback="chooseCallback" let-uploadCallback="uploadCallback" let-clearCallback="clearCallback">
                                <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                                    <div class="flex gap-2">
                                        <p-button (click)="chooseCallback()" icon="pi pi-images" [rounded]="true" [outlined]="true" severity="secondary" />
                                        <p-button (click)="uploadEvent(uploadCallback)" icon="pi pi-cloud-upload" [rounded]="true" [outlined]="true" severity="success" [disabled]="!files || files.length === 0" />
                                        <p-button (click)="clearCallback()" icon="pi pi-times" [rounded]="true" [outlined]="true" severity="danger" [disabled]="!files || files.length === 0" />
                                    </div>
                                </div>
                            </ng-template>
                            <ng-template #content let-files="files" let-uploadedFiles="uploadedFiles" let-removeUploadedFileCallback="removeUploadedFileCallback" let-removeFileCallback="removeFileCallback">
                                <div class="flex flex-col gap-8 pt-4">
                                    @if (files?.length > 0) {
                                        <div>
                                            <h5>Pending</h5>
                                            <div class="flex flex-wrap gap-4">
                                                @for (file of files; track file.name + file.type + file.size; let i = $index) {
                                                    <div class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                                                        <div>
                                                            <img role="presentation" [alt]="file.name" [src]="file.objectURL" width="100" height="50" />
                                                        </div>
                                                        <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                                                        <div>{{ formatSize(file.size) }}</div>
                                                        <p-badge value="Pending" severity="warn" />
                                                        <p-button icon="pi pi-times" (click)="onRemoveTemplatingFile(file, removeFileCallback, i)" [outlined]="true" [rounded]="true" severity="danger" />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    }

                                    @if (uploadedFiles.length > 0) {
                                        <div>
                                            <h5>Completed</h5>
                                            <div class="flex flex-wrap gap-4">
                                                @for (file of uploadedFiles; track file.name + file.type + file.size; let i = $index) {
                                                    <div class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                                                        <div>
                                                            <img role="presentation" [alt]="file.name" [src]="file.objectURL" width="100" height="50" />
                                                        </div>
                                                        <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                                                        <div>{{ formatSize(file.size) }}</div>
                                                        <p-badge value="Completed" styleClass="mt-4" severity="success" />
                                                        <p-button icon="pi pi-times" (click)="removeUploadedFileCallback(i)" [outlined]="true" [rounded]="true" severity="danger" />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                            </ng-template>
                            <ng-template #empty>
                                <div class="flex items-center justify-center flex-col">
                                    <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color"></i>
                                    <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
                                </div>
                            </ng-template>
                        </p-fileupload>
                    </div>
                </div>
            </ng-template>
        </p-drawer>
    `
})
export class AppRightMenu {
    private primeng = inject(PrimeNG);

    private layoutService = inject(LayoutService);

    get rightMenuVisible(): boolean {
        return this.layoutService.layoutState().rightMenuVisible;
    }

    set rightMenuVisible(_val: boolean) {
        this.layoutService.layoutState.update((prev) => ({ ...prev, rightMenuVisible: _val }));
    }

    readonly separatorClass = 'font-medium bg-surface-100 dark:bg-surface-900 px-6 py-2 flex items-center justify-between';

    selectedPricingModel = model<PricingModel | null>(null);
    readonly pricingModels: PricingModel[] = [
        { name: 'Free', code: 'FREE' },
        { name: 'Basic', code: 'BASIC' },
        { name: 'Pro', code: 'PRO' },
        { name: 'Enterprise', code: 'ENT' },
        { name: 'Custom', code: 'CUST' }
    ];

    selectedTaxCategory = model<TaxCategory | null>(null);
    readonly taxCategories: TaxCategory[] = [
        { name: 'Standard Rate', code: 'STD' },
        { name: 'Reduced Rate', code: 'RED' },
        { name: 'Zero Rate', code: 'ZERO' },
        { name: 'Exempt', code: 'EXEMPT' },
        { name: 'Out of Scope', code: 'OOS' }
    ];

    priceValue = model<number | null>(null);
    totalSize = signal<number>(0);
    totalSizePercent = signal<number>(0);
    files = signal<File[]>([]);

    onHide() {
        this.layoutService.layoutState.update((state) => ({
            ...state,
            rightMenuVisible: false
        }));
    }

    toggle() {
        this.layoutService.toggleRightMenu();
    }

    onRemoveTemplatingFile(file: any, removeFileCallback: (index: number) => void, index: number) {
        removeFileCallback(index);
        this.totalSize.update((size) => size - parseInt(this.formatSize(file.size)));
        this.totalSizePercent.set(this.totalSize() / 10);
    }

    onSelectedFiles(event: FileSelectEvent) {
        this.files.set(event.files as File[]);
        let size = 0;
        event.files.forEach((file: File) => {
            size += parseInt(this.formatSize(file.size));
        });
        this.totalSize.update((s) => s + size);
    }

    uploadEvent(callback: () => void) {
        this.totalSizePercent.set(this.totalSize() / 10);
        callback();
    }

    formatSize(bytes: number): string {
        const k = 1024;
        const dm = 3;
        const sizes = this.primeng.translation?.fileSizeTypes || ['B', 'KB', 'MB', 'GB', 'TB'];

        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return `${formattedSize} ${sizes[i]}`;
    }
}
