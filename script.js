document.addEventListener('DOMContentLoaded', function() {
    // Browser Action başlangıç durumu
    const browserActionSettings = document.querySelector('.browser-action-settings');
    browserActionSettings.querySelectorAll('input').forEach(input => {
        input.disabled = false;
    });

    // Tema yönetimi
    const themeSwitcher = document.getElementById('themeSwitcher');
    const lightIcon = document.getElementById('lightIcon');
    const darkIcon = document.getElementById('darkIcon');
    
    // Yerel depolamadan tema tercihini al veya varsayılan olarak dark tema kullan
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
    
    themeSwitcher.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
    });
    
    function updateThemeIcons(theme) {
        if (theme === 'dark') {
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
        } else {
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
        }
    }

    const form = document.getElementById('manifestForm');
    const manifestPreview = document.getElementById('manifestPreview');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const name = document.getElementById('name');
    const shortName = document.getElementById('shortName');
    const customHost = document.getElementById('customHost');
    const customHostPattern = document.getElementById('customHostPattern');
    const hasBackground = document.getElementById('hasBackground');
    const backgroundScripts = document.getElementById('backgroundScripts');
    const addScript = document.getElementById('addScript');
    const hasCommands = document.getElementById('hasCommands');
    const commandShortcut = document.getElementById('commandShortcut');
    const commandDescription = document.getElementById('commandDescription');

    // İkon yolları için input elementlerini etkinleştir/devre dışı bırak
    document.querySelectorAll('.icon-item input[type="checkbox"]').forEach(checkbox => {
        const pathInput = checkbox.parentElement.querySelector('.icon-path');
        checkbox.addEventListener('change', () => {
            pathInput.disabled = !checkbox.checked;
        });
        pathInput.disabled = !checkbox.checked;
    });

    // Özel host pattern kontrolü
    customHost.addEventListener('change', function() {
        customHostPattern.disabled = !this.checked;
    });

    // Background scripts kontrolü ve script ekleme
    let scriptCount = 1;
    const scriptList = new Set();

    hasBackground.addEventListener('change', function() {
        const backgroundSettings = document.querySelector('.background-settings');
        backgroundSettings.querySelectorAll('input, button').forEach(el => {
            el.disabled = !this.checked;
        });
    });

    addScript.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `background${scriptCount > 1 ? scriptCount : ''}.js`;
        input.className = 'script-input';
        scriptCount++;
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-script';
        removeBtn.textContent = '×';
        removeBtn.onclick = function() {
            input.remove();
            removeBtn.remove();
            updateManifest();
        };

        const container = document.createElement('div');
        container.className = 'script-container';
        container.appendChild(input);
        container.appendChild(removeBtn);

        document.querySelector('.background-settings').insertBefore(
            container,
            addScript
        );
        updateManifest();
    });

    // Browser Action kontrolü
    document.getElementById('hasBrowserAction').addEventListener('change', function() {
        const settings = document.querySelector('.browser-action-settings');
        settings.querySelectorAll('input').forEach(input => {
            input.disabled = !this.checked;
        });
    });

    // Komut ayarları kontrolü
    hasCommands.addEventListener('change', function() {
        commandShortcut.disabled = !this.checked;
        commandDescription.disabled = !this.checked;
    });

    // Kısa ad otomatik doldurma
    name.addEventListener('input', function() {
        if (!shortName.value) {
            shortName.placeholder = this.value;
        }
    });

    // Web Erişilebilir Kaynaklar kontrolü
    const hasWebAccessible = document.getElementById('hasWebAccessible');
    const addResource = document.getElementById('addResource');

    hasWebAccessible.addEventListener('change', function() {
        const settings = document.querySelector('.web-accessible-settings');
        settings.querySelectorAll('input, button').forEach(el => {
            el.disabled = !this.checked;
        });
    });

    addResource.addEventListener('click', function() {
        const container = document.createElement('div');
        container.className = 'resource-container';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'resource-input';
        input.placeholder = 'images/resource.png';
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-resource';
        removeBtn.textContent = '×';
        removeBtn.onclick = function() {
            container.remove();
            updateManifest();
        };
        
        container.appendChild(input);
        container.appendChild(removeBtn);
        
        document.querySelector('.web-accessible-settings').insertBefore(
            container,
            addResource
        );
        updateManifest();
    });

    // Content Scripts kontrolü
    const hasContentScripts = document.getElementById('hasContentScripts');
    const addContentScript = document.getElementById('addContentScript');

    hasContentScripts.addEventListener('change', function() {
        const settings = document.querySelector('.content-scripts-settings');
        settings.querySelectorAll('input, button').forEach(el => {
            el.disabled = !this.checked;
        });
    });

    addContentScript.addEventListener('click', function() {
        const container = document.createElement('div');
        container.className = 'content-script-container';
        
        const scriptInput = document.createElement('input');
        scriptInput.type = 'text';
        scriptInput.className = 'script-path';
        scriptInput.placeholder = 'content/script.js';
        
        const matchesInput = document.createElement('input');
        matchesInput.type = 'text';
        matchesInput.className = 'script-matches';
        matchesInput.placeholder = '*://*.example.com/*';
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-content-script';
        removeBtn.textContent = '×';
        removeBtn.onclick = function() {
            container.remove();
            updateManifest();
        };
        
        container.appendChild(scriptInput);
        container.appendChild(matchesInput);
        container.appendChild(removeBtn);
        
        document.querySelector('.content-scripts-settings').insertBefore(
            container,
            addContentScript
        );
        updateManifest();
    });

    // Event listener'ları ekleyin
    document.getElementById('hasProtocolHandlers').addEventListener('change', function() {
        const settings = document.querySelector('.protocol-handlers-settings');
        settings.querySelectorAll('input').forEach(input => {
            input.disabled = !this.checked;
        });
    });

    document.getElementById('hasChromeSettings').addEventListener('change', function() {
        const settings = document.querySelector('.chrome-settings');
        settings.querySelectorAll('input').forEach(input => {
            input.disabled = !this.checked;
        });
    });

    function updateManifest() {
        const manifest = {
            manifest_version: parseInt(document.getElementById('manifestVersion').value),
            name: name.value || "",
            version: document.getElementById('version').value || "1.0",
            description: document.getElementById('description').value || "",
        };

        // İkonları ekle
        const icons = {};
        document.querySelectorAll('.icon-item').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const pathInput = item.querySelector('.icon-path');
            if (checkbox.checked) {
                const size = checkbox.id.replace('icon', '');
                icons[size] = pathInput.value || pathInput.placeholder;
            }
        });
        
        if (Object.keys(icons).length > 0) {
            manifest.icons = icons;
        }

        // İzinleri ekle
        const permissions = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked:not(#customHost)'))
            .map(cb => cb.value)
            .filter(val => val !== 'on');

        if (customHost.checked && customHostPattern.value) {
            permissions.push(customHostPattern.value);
        }

        if (permissions.length > 0) {
            manifest.permissions = permissions;
        }

        // Browser Action - default_title için shortName kullan
        if (document.getElementById('hasBrowserAction').checked) {
            manifest.browser_action = {
                default_icon: icons['48'] || "",
                default_title: shortName.value || name.value || "",
                default_popup: "popup/popup.html"
            };
        }

        // Background Scripts
        if (hasBackground.checked) {
            const scripts = Array.from(
                document.querySelectorAll('.background-settings .script-input')
            )
            .map(input => input.value || input.placeholder)
            .filter(Boolean);

            if (scripts.length > 0) {
                manifest.background = {
                    scripts: scripts
                };
            }
        }

        // Commands
        if (hasCommands.checked && commandShortcut.value && commandDescription.value) {
            manifest.commands = {
                "_execute_browser_action": {
                    "suggested_key": {
                        "default": commandShortcut.value
                    },
                    "description": commandDescription.value
                }
            };
        }

        // Web Erişilebilir Kaynaklar
        if (hasWebAccessible.checked) {
            const resources = Array.from(
                document.querySelectorAll('.resource-input')
            )
            .map(input => input.value || input.placeholder)
            .filter(Boolean);

            if (resources.length > 0) {
                manifest.web_accessible_resources = resources;
            }
        }

        // Content Scripts
        if (hasContentScripts.checked) {
            const contentScripts = Array.from(
                document.querySelectorAll('.content-script-container')
            ).map(container => ({
                js: [container.querySelector('.script-path').value || container.querySelector('.script-path').placeholder],
                matches: [container.querySelector('.script-matches').value || container.querySelector('.script-matches').placeholder]
            })).filter(script => script.js[0] && script.matches[0]);

            if (contentScripts.length > 0) {
                manifest.content_scripts = contentScripts;
            }
        }

        // İsteğe Bağlı İzinler
        const optionalPermissions = Array.from(
            document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked')
        )
        .map(cb => cb.value)
        .filter(val => val !== 'on' && !manifest.permissions.includes(val));

        if (optionalPermissions.length > 0) {
            manifest.optional_permissions = optionalPermissions;
        }

        // Update URL
        const updateUrl = document.getElementById('updateUrl').value;
        if (updateUrl) {
            manifest.update_url = updateUrl;
        }

        // Homepage URL
        const homepageUrl = document.getElementById('homepageUrl').value;
        if (homepageUrl) {
            manifest.homepage_url = homepageUrl;
        }

        // Author
        const author = document.getElementById('author').value;
        if (author) {
            manifest.author = author;
        }

        // Developer
        const developerName = document.getElementById('developerName').value;
        const developerUrl = document.getElementById('developerUrl').value;
        if (developerName || developerUrl) {
            manifest.developer = {
                name: developerName || undefined,
                url: developerUrl || undefined
            };
        }

        // Browser Action rengi
        const backgroundColor = document.getElementById('backgroundColor').value;
        if (backgroundColor && backgroundColor !== '#ff0000' && manifest.browser_action) {
            manifest.browser_action.default_icon_color = backgroundColor;
        }

        // Tema rengi
        const themeColor = document.getElementById('themeColor').value;
        if (themeColor && themeColor !== '#4f46e5') {
            manifest.theme_color = themeColor;
        }

        // Firefox versiyonu uyumluluğu
        const minVersion = document.getElementById('minVersion').value;
        const maxVersion = document.getElementById('maxVersion').value;
        
        if (minVersion || maxVersion) {
            manifest.applications = {
                gecko: {
                    id: `${manifest.name.toLowerCase().replace(/\s+/g, '-')}@example.com`,
                    strict_min_version: minVersion || "42.0",
                    strict_max_version: maxVersion || "*"
                }
            };
        }

        // Çeviri desteği
        const defaultLocale = document.getElementById('defaultLocale').value;
        if (defaultLocale) {
            manifest.default_locale = "tr";
        }

        // Protokol işleyicileri
        if (document.getElementById('hasProtocolHandlers').checked) {
            const protocolName = document.getElementById('protocolName').value;
            const protocolTemplate = document.getElementById('protocolTemplate').value;
            
            if (protocolName && protocolTemplate) {
                manifest.protocol_handlers = [{
                    protocol: protocolName,
                    name: protocolName + " Handler",
                    uriTemplate: protocolTemplate
                }];
            }
        }

        // Chrome ayarları
        if (document.getElementById('hasChromeSettings').checked) {
            const homepage = document.getElementById('chromeHomepage').value;
            const searchProviderName = document.getElementById('searchProviderName').value;
            const searchUrl = document.getElementById('searchUrl').value;

            if (homepage || (searchProviderName && searchUrl)) {
                manifest.chrome_settings_overrides = {};
                
                if (homepage) {
                    manifest.chrome_settings_overrides.homepage = homepage;
                }
                
                if (searchProviderName && searchUrl) {
                    manifest.chrome_settings_overrides.search_provider = {
                        name: searchProviderName,
                        search_url: searchUrl,
                        keyword: searchProviderName.toLowerCase().replace(/\s+/g, '-')
                    };
                }
            }
        }

        // Önizlemeyi güncelle
        manifestPreview.textContent = JSON.stringify(manifest, null, 2);
    }

    // Form değişikliklerini dinle
    form.addEventListener('input', updateManifest);
    form.addEventListener('change', updateManifest);

    // Kopyalama işlevi
    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(manifestPreview.textContent)
            .then(() => {
                copyBtn.textContent = translations[lang].copied;
                setTimeout(() => copyBtn.textContent = translations[lang].copy, 2000);
            })
            .catch(err => alert(translations[lang].copyError));
    });

    // İndirme işlevi
    downloadBtn.addEventListener('click', function() {
        const blob = new Blob([manifestPreview.textContent], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'manifest.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Format butonu işlevselliği
    const formatBtn = document.getElementById('formatBtn');
    let isFormatted = true; // Varsayılan olarak formatlanmış görünüm

    formatBtn.addEventListener('click', function() {
        const currentJson = JSON.parse(manifestPreview.textContent);
        
        if (isFormatted) {
            // Sıkıştırılmış format
            manifestPreview.textContent = JSON.stringify(currentJson);
            manifestPreview.classList.add('compressed');
            formatBtn.title = "Formatı Düzenle";
        } else {
            // Güzel format
            manifestPreview.textContent = JSON.stringify(currentJson, null, 2);
            manifestPreview.classList.remove('compressed');
            formatBtn.title = "Formatı Sıkıştır";
        }
        
        isFormatted = !isFormatted;
    });

    // Sayfa yüklendiğinde ilk önizlemeyi oluştur
    updateManifest();

    // Form sıfırlama
    const resetBtn = document.getElementById('resetForm');
    resetBtn.addEventListener('click', function() {
        form.reset();
        // Checkbox ve switch'leri sıfırla
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
            // Input'ları disable et
            const container = cb.closest('.sub-form');
            if (container) {
                container.querySelectorAll('input:not([type="checkbox"]), button').forEach(el => {
                    el.disabled = true;
                });
            }
        });
        // İkon yollarını sıfırla
        document.querySelectorAll('.icon-path').forEach(input => {
            input.disabled = true;
            input.value = '';
        });
        // Manifest'i güncelle
        updateManifest();
    });

    // Üstteki ikonlu butonlar için event listener'lar
    document.getElementById('copyPreviewBtn').addEventListener('click', function() {
        navigator.clipboard.writeText(manifestPreview.textContent)
            .then(() => {
                this.title = 'Kopyalandı!';
                setTimeout(() => this.title = 'Kopyala', 2000);
            })
            .catch(err => alert('Kopyalama başarısız: ' + err));
    });

    document.getElementById('downloadPreviewBtn').addEventListener('click', function() {
        const blob = new Blob([manifestPreview.textContent], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'manifest.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // İkon yükleme ve işleme fonksiyonları
    const iconUpload = document.getElementById('iconUpload');
    const uploadButton = document.getElementById('uploadButton');
    const iconPreview = document.getElementById('iconPreview');

    uploadButton.addEventListener('click', () => iconUpload.click());

    iconUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = iconPreview.querySelector('img');
                img.src = e.target.result;
                iconPreview.classList.remove('hidden');
                
                // Otomatik olarak tüm boyutları oluştur
                generateAllIcons(e.target.result);
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // İkon kaldırma butonu için event listener
    document.getElementById('removeIcon').addEventListener('click', function() {
        // Önizlemeyi temizle
        iconPreview.classList.add('hidden');
        iconPreview.querySelector('img').src = '';
        
        // Tüm küçük önizlemeleri temizle
        document.querySelectorAll('.icon-preview-small').forEach(preview => {
            preview.src = '';
        });
        
        // Checkbox'ları temizle
        document.querySelectorAll('.icon-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Input değerlerini temizle
        document.querySelectorAll('.icon-path').forEach(input => {
            input.value = '';
            input.disabled = true;
        });
        
        // Input'u sıfırla
        iconUpload.value = '';
        
        // Manifest'i güncelle
        updateManifest();
    });

    // Otomatik boyutlandırma fonksiyonu
    function generateAllIcons(imageSource) {
        const sizes = [16, 48, 96, 128];
        const img = new Image();
        
        img.onload = function() {
            sizes.forEach(size => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = size;
                canvas.height = size;
                
                // Görüntüyü yeniden boyutlandır
                ctx.drawImage(img, 0, 0, size, size);
                
                // Önizlemeyi güncelle
                const preview = document.querySelector(`.icon-preview-small[data-size="${size}"]`);
                preview.src = canvas.toDataURL('image/png');
                
                // İndirme butonunu ayarla
                const downloadBtn = document.querySelector(`.download-icon[data-size="${size}"]`);
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.download = `icon-${size}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                };
                
                // Input değerini güncelle
                const input = document.querySelector(`#icon${size}`).parentElement.querySelector('.icon-path');
                input.value = `icons/icon-${size}.png`;
                input.disabled = false;
                
                // Checkbox'ı işaretle
                document.querySelector(`#icon${size}`).checked = true;
            });
            
            // Manifest'i güncelle
            updateManifest();
        };
        
        img.src = imageSource;
    }

    // Drag & Drop desteği
    const iconContainer = document.querySelector('.icon-upload');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        iconContainer.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        iconContainer.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        iconContainer.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        iconContainer.classList.add('drag-highlight');
    }

    function unhighlight(e) {
        iconContainer.classList.remove('drag-highlight');
    }

    iconContainer.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        
        if (file && file.type.startsWith('image/')) {
            iconUpload.files = dt.files;
            iconUpload.dispatchEvent(new Event('change'));
        }
    }

    // JSZip kütüphanesini head'e ekle
    function loadJSZip() {
        return new Promise((resolve, reject) => {
            if (window.JSZip) {
                resolve(window.JSZip);
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => resolve(window.JSZip);
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Türkçe karakterleri ve özel karakterleri temizleme fonksiyonu
    function slugify(text) {
        const trMap = {
            'ğ': 'g', 'Ğ': 'G',
            'ü': 'u', 'Ü': 'U',
            'ş': 's', 'Ş': 'S',
            'ı': 'i', 'İ': 'I',
            'ö': 'o', 'Ö': 'O',
            'ç': 'c', 'Ç': 'C'
        };
        
        return text
            .toLowerCase()
            .replace(/[ğüşıöçĞÜŞİÖÇ]/g, letter => trMap[letter])
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // Tarih formatı oluşturma fonksiyonu
    function getFormattedDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear());
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${day}${month}-${year}-${hours}-${minutes}-${seconds}`;
    }

    // Zip indirme fonksiyonu
    async function downloadAsZip() {
        try {
            const JSZip = await loadJSZip();
            const zip = new JSZip();

            const extensionName = document.getElementById('name').value || 'extension';
            const version = document.getElementById('version').value || '1.0';
            const dateStr = getFormattedDate();
            
            const fileName = `${slugify(extensionName)}-${version}-${dateStr}.zip`;

            // manifest.json ekle
            zip.file('manifest.json', manifestPreview.textContent);

            // icons klasörü oluştur
            const iconsFolder = zip.folder('icons');
            const iconPromises = [];

            // İkonları ekle
            document.querySelectorAll('.icon-preview-small[src]').forEach(img => {
                if (img.src) {
                    const size = img.dataset.size;
                    const fileName = `icon-${size}.png`;
                    
                    // Canvas'tan blob oluştur
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = size;
                    canvas.height = size;
                    ctx.drawImage(img, 0, 0, size, size);
                    
                    const promise = new Promise(resolve => {
                        canvas.toBlob(blob => {
                            iconsFolder.file(fileName, blob);
                            resolve();
                        }, 'image/png');
                    });
                    
                    iconPromises.push(promise);
                }
            });

            // popup klasörü oluştur
            const popupFolder = zip.folder('popup');
            
            // Örnek popup dosyaları ekle
            const popupHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="popup.css">
</head>
<body>
    <div class="popup-container">
        <h1>${document.getElementById('name').value || 'My Extension'}</h1>
    </div>
    <script src="popup.js"></script>
</body>
</html>`;

            const popupCSS = `body {
    width: 300px;
    padding: 16px;
    font-family: system-ui, -apple-system, sans-serif;
}

.popup-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

h1 {
    margin: 0;
    font-size: 18px;
    color: #4F46E5;
}`;

            const popupJS = `document.addEventListener('DOMContentLoaded', function() {
    // Popup script
    console.log('Popup loaded');
});`;

            popupFolder.file('popup.html', popupHTML);
            popupFolder.file('popup.css', popupCSS);
            popupFolder.file('popup.js', popupJS);

            // İkonların yüklenmesini bekle
            await Promise.all(iconPromises);

            // Zip'i oluştur ve indir
            const blob = await zip.generateAsync({type: 'blob'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Zip oluşturma hatası:', error);
            alert('Zip dosyası oluşturulurken bir hata oluştu.');
        }
    }

    // Zip indirme butonu için event listener
    document.getElementById('downloadZipBtn').addEventListener('click', downloadAsZip);

    // Dil çevirileri
    const translations = {
        tr: {
            // Başlıklar
            title: "Manifest Özellikleri",
            basicInfo: "Temel Bilgiler",
            
            // Form etiketleri
            extensionName: "Eklenti Adı",
            extensionTitle: "Eklenti Başlığı",
            description: "Eklenti Açıklaması",
            version: "Versiyon",
            
            // Tooltip metinleri
            extensionNameTooltip: "Eklentinizin tam adı. Firefox'ta görüntülenecek isim.",
            extensionTitleTooltip: "Browser Action butonu üzerinde görünecek başlık. Boş bırakılırsa eklenti adı kullanılır.",
            descriptionTooltip: "Eklentinizin ne işe yaradığını açıklayan kısa bir metin. Firefox mağazasında görüntülenir.",
            
            // Butonlar
            uploadIcon: "İkon Yükle",
            removeIcon: "İkonu Kaldır",
            copyManifest: "Kopyala",
            downloadManifest: "manifest.json",
            downloadZip: "Zip Olarak İndir",
            resetForm: "Formu Sıfırla",
            
            // Diğer metinler
            dragDropHint: "İkon yüklemek için sürükleyip bırakın",
            copied: "Kopyalandı!",
            downloadError: "İndirme hatası oluştu",
            preview: "Önizleme",
            icons: "İkonlar",
            permissions: "İzinler",
            basicPermissions: "Temel İzinler",
            hostPermissions: "Host İzinleri",
            allUrls: "Tüm URL'ler (*://*/*)",
            customHost: "Özel Host İzni",
            customHostPattern: "örn: *://*.example.com/*",
            extensionSettings: "Eklenti Ayarları",
            browserAction: "Browser Action",
            backgroundScripts: "Arka Plan Scriptleri",
            contentScripts: "İçerik Scriptleri",
            shortcuts: "Kısayol Tuşları",
            advancedFeatures: "Gelişmiş Özellikler",
            webAccessibleResources: "Web Erişilebilir Kaynaklar",
            optionalPermissions: "İsteğe Bağlı İzinler",
            updateUrl: "Güncelleme URL'i",
            homepageUrl: "Ana Sayfa URL'i",
            author: "Yazar",
            developerInfo: "Geliştirici Bilgileri",
            developerName: "Geliştirici Adı",
            developerUrl: "Geliştirici URL",
            backgroundColor: "Arka Plan Rengi",
            themeColor: "Tema Rengi",
            minFirefoxVersion: "Minimum Firefox Versiyonu",
            maxFirefoxVersion: "Maksimum Firefox Versiyonu",
            translationFiles: "Çeviri Dosyaları",
            protocolHandlers: "Protokol İşleyicileri",
            chromeSettings: "Chrome Ayarları",
            extensionTitle: "Eklenti Başlığı",
            manifestVersion: "Manifest Versiyonu",
            version: "Versiyon",
            download: "İndir",
            shortNamePlaceholder: "Araç çubuğu için kısa ad",
            themeSwitch: "Tema Değiştir",
            shortcutPlaceholder: "Ctrl+Shift+Y",
            shortcutDescriptionPlaceholder: "Kısayol açıklaması",
            advancedFeatures: "Gelişmiş Özellikler",
            webAccessibleResources: "Web Erişilebilir Kaynaklar",
            addResource: "+ Kaynak Ekle",
            addScript: "+ Script Ekle",
            optionalPermissions: "İsteğe Bağlı İzinler",
            developerNamePlaceholder: "Geliştirici Adı",
            developerUrlPlaceholder: "Geliştirici URL",
            protocolNamePlaceholder: "magnet",
            protocolTemplatePlaceholder: "https://example.com/handler?url=%s",
            chromeHomepagePlaceholder: "https://example.com",
            searchProviderNamePlaceholder: "Özel Arama",
            searchUrlPlaceholder: "https://example.com/search?q={searchTerms}",
            activeTabTooltip: "Aktif sekmeye erişim sağlar. Kullanıcının şu anda görüntülediği web sayfasıyla etkileşime girmenizi sağlar.",
            tabsTooltip: "Tüm sekmelere erişim sağlar. Sekmeleri açma, kapatma ve yönetme yetkisi verir.",
            storageTooltip: "Eklenti verilerini kalıcı olarak depolamanızı sağlar.",
            cookiesTooltip: "Web sitelerinin çerezlerine erişim ve düzenleme izni verir.",
            webRequestTooltip: "Web isteklerini izleme ve analiz etme izni verir.",
            webRequestBlockingTooltip: "Web isteklerini engelleme veya değiştirme izni verir.",
            contextMenusTooltip: "Sağ tık menüsüne özel seçenekler eklemenizi sağlar.",
            downloadsOpenTooltip: "İndirilen dosyaları otomatik olarak açma izni.",
            identityTooltip: "Firefox hesabı ile kimlik doğrulama yapabilme izni.",
            nativeMessagingTooltip: "Yerel uygulamalarla iletişim kurma izni.",
            privacyTooltip: "Gizlilik ayarlarını okuma ve değiştirme izni.",
            bookmarksTooltip: "Yer imlerini görüntüleme ve düzenleme izni.",
            clipboardReadTooltip: "Panodaki içeriği okuma izni.",
            clipboardWriteTooltip: "Panoya içerik yazma izni.",
            downloadsTooltip: "İndirme işlemlerini yönetme izni.",
            historyTooltip: "Tarayıcı geçmişine erişim izni.",
            notificationsTooltip: "Bildirim gösterme izni.",
            pageTitle: "Firefox Eklenti Manifest Oluşturucu",
            manifestV2: "Manifest V2",
            manifestV3: "Manifest V3",
            versionPlaceholder: "1.0, 1.2.3",
            updateUrlPlaceholder: "https://example.com/updates.xml",
            homepageUrlPlaceholder: "https://example.com/extension",
            authorPlaceholder: "Ad Soyad veya Organizasyon",
            minVersionPlaceholder: "42.0",
            maxVersionPlaceholder: "*",
            defaultLocalePlaceholder: "_locales/tr/messages.json",
            copy: "Kopyala",
            copied: "Kopyalandı!",
            download: "İndir",
            icons: "İkonlar",
            permissions: "İzinler",
            basicPermissions: "Temel İzinler",
            hostPermissions: "Host İzinleri",
            extensionSettings: "Eklenti Ayarları",
            uploadIcon: "İkon Yükle",
            downloadZip: "Zip Olarak İndir",
            copyTitle: "Kopyala",
            downloadTitle: "İndir",
            formatTitle: "Formatı Sıkıştır",
            copyError: "Kopyalama başarısız: ",
            iconPreviewAlt: "İkon önizleme",
            removeIconTitle: "İkonu Kaldır",
            addScriptBtn: "+ Script Ekle",
            hostPermissionsTooltip: "Web sitelerine erişim izinleri. Tüm URL'lere veya belirli domainlere erişim sağlar.",
            basicPermissionsTooltip: "Eklentinizin temel işlevleri için gereken izinler.",
            developerInfoTooltip: "Eklentinin geliştiricisi hakkında bilgiler.",
            backgroundColorTooltip: "Browser Action ikonunun arka plan rengi.",
            themeColorTooltip: "Eklentinin tema rengi.",
            minFirefoxVersionTooltip: "Eklentinin çalışması için gereken minimum Firefox sürümü.",
            maxFirefoxVersionTooltip: "Eklentinin desteklediği maksimum Firefox sürümü.",
            translationFilesTooltip: "Eklentinin çeviri dosyalarının konumu.",
            versionTooltip: "Eklentinizin sürüm numarası. Örnek: 1.0, 1.2.3",
            optionalPermissionsTooltip: "Kullanıcıdan gerektiğinde istenecek ek izinler. İlk yüklemede değil, ihtiyaç duyulduğunda talep edilir.",
            bookmarksTooltip: "Yer imlerini görüntüleme ve düzenleme izni.",
            clipboardReadTooltip: "Panodaki içeriği okuma izni.",
            clipboardWriteTooltip: "Panoya içerik yazma izni.",
            downloadsTooltip: "İndirme işlemlerini yönetme izni.",
            historyTooltip: "Tarayıcı geçmişine erişim izni.",
            notificationsTooltip: "Bildirim gösterme izni.",
            updateUrlTooltip: "Eklentinin güncellemelerinin kontrol edileceği URL.",
            homepageUrlTooltip: "Eklentinin ana sayfa URL'i. Firefox mağazasında görüntülenir.",
            authorTooltip: "Eklentiyi geliştiren kişi veya organizasyon.",
            shortcutsTooltip: "Eklentiyi tetiklemek için klavye kısayolları tanımlayabilirsiniz. Örn: Ctrl+Shift+Y",
            protocolHandlersTooltip: "Özel protokolleri (magnet: gibi) eklentinizde işleyebilirsiniz.",
            chromeSettingsTooltip: "Tarayıcı ana sayfası ve arama sağlayıcısı ayarları.",
            descriptionTooltip: "Eklentinizin ne işe yaradığını açıklayan kısa bir metin. Firefox mağazasında görüntülenir.",
            versionTooltip: "Eklentinizin sürüm numarası. Örnek: 1.0, 1.2.3",
            popupPlaceholder: "popup/popup.html",
            scriptPlaceholder: "content/script.js",
            matchesPlaceholder: "*://*.example.com/*",
            resourcePlaceholder: "images/logo.png",
            iconPathPlaceholder: "icons/icon-{size}.png"
        },
        en: {
            // Titles
            title: "Manifest Properties",
            basicInfo: "Basic Information",
            advancedFeatures: "Advanced Features",
            preview: "Preview",
            
            // Form labels
            extensionName: "Extension Name",
            extensionTitle: "Extension Title",
            description: "Description",
            version: "Version",
            manifestVersion: "Manifest Version",
            
            // Buttons and actions
            copy: "Copy",
            copied: "Copied!",
            download: "Download",
            uploadIcon: "Upload Icon",
            removeIcon: "Remove Icon",
            downloadZip: "Download as ZIP",
            resetForm: "Reset Form",
            addScript: "+ Add Script",
            addResource: "+ Add Resource",
            
            // Sections
            icons: "Icons",
            permissions: "Permissions",
            basicPermissions: "Basic Permissions",
            hostPermissions: "Host Permissions",
            extensionSettings: "Extension Settings",
            
            // Browser Action
            browserAction: "Browser Action",
            backgroundScripts: "Background Scripts",
            contentScripts: "Content Scripts",
            shortcuts: "Keyboard Shortcuts",
            webAccessibleResources: "Web Accessible Resources",
            protocolHandlers: "Protocol Handlers",
            chromeSettings: "Chrome Settings",
            
            // URLs and Paths
            updateUrl: "Update URL",
            homepageUrl: "Homepage URL",
            
            // Developer Info
            author: "Author",
            developerInfo: "Developer Information",
            
            // Colors
            backgroundColor: "Background Color",
            themeColor: "Theme Color",
            
            // Firefox Version
            minFirefoxVersion: "Minimum Firefox Version",
            maxFirefoxVersion: "Maximum Firefox Version",
            
            // Other Settings
            translationFiles: "Translation Files",
            
            // Tooltips
            extensionNameTooltip: "The full name of your extension. This will be displayed in Firefox.",
            extensionTitleTooltip: "Title shown on the Browser Action button. If empty, extension name will be used.",
            descriptionTooltip: "A short description explaining what your extension does. This will be displayed in the Firefox store.",
            manifestVersionTooltip: "Manifest V2: Supports legacy APIs. V3: Includes new security features and is recommended.",
            browserActionTooltip: "Defines the icon and popup window in the browser toolbar.",
            backgroundScriptsTooltip: "Scripts that run in the background. Provides main functionality for your extension.",
            contentScriptsTooltip: "Scripts that run on specific web pages. Allows interaction with page content.",
            shortcutsTooltip: "Define keyboard shortcuts to trigger your extension. Example: Ctrl+Shift+Y",
            webAccessibleTooltip: "Specify extension resources (images, scripts, etc.) that should be accessible from web pages.",
            protocolHandlersTooltip: "Handle custom protocols (like magnet:) in your extension.",
            chromeSettingsTooltip: "Browser homepage and search provider settings.",
            
            // Messages
            downloadError: "Download error occurred",
            dragDropHint: "Drag and drop to upload icon",
            
            // Placeholders
            namePlaceholder: "Enter extension name",
            descriptionPlaceholder: "Enter extension description",
            shortNamePlaceholder: "Short name for toolbar",
            searchProviderNamePlaceholder: "Custom Search",
            searchUrlPlaceholder: "https://example.com/search?q={searchTerms}",
            defaultLocalePlaceholder: "_locales/en/messages.json",
            allUrls: "All URLs (*://*/*)",
            customHost: "Custom Host Permission",
            customHostPattern: "e.g. *://*.example.com/*",
            hostPermissionsTooltip: "Website access permissions. Allows access to all URLs or specific domains.",
            basicPermissionsTooltip: "Permissions required for basic functionality of your extension.",
            developerInfoTooltip: "Information about the extension developer.",
            backgroundColorTooltip: "Background color of the Browser Action icon.",
            themeColorTooltip: "Theme color of the extension.",
            minFirefoxVersionTooltip: "Minimum Firefox version required for the extension to work.",
            maxFirefoxVersionTooltip: "Maximum Firefox version supported by the extension.",
            translationFilesTooltip: "Location of extension translation files.",
            versionTooltip: "Version number of your extension. Example: 1.0, 1.2.3",
            
            // Optional Permissions Section
            optionalPermissions: "Optional Permissions",
            optionalPermissionsTooltip: "Additional permissions that will be requested from the user when needed, not at initial installation.",
            
            // Optional Permission Items
            bookmarksTooltip: "Permission to view and modify bookmarks.",
            clipboardReadTooltip: "Permission to read clipboard content.",
            clipboardWriteTooltip: "Permission to write to clipboard.",
            downloadsTooltip: "Permission to manage downloads.",
            historyTooltip: "Permission to access browser history.",
            notificationsTooltip: "Permission to show notifications.",
            
            // Basic Permissions Section
            activeTabTooltip: "Permission to access the active tab and interact with its content.",
            tabsTooltip: "Permission to manage browser tabs (open, close, modify).",
            storageTooltip: "Permission to store extension data persistently.",
            cookiesTooltip: "Permission to read and modify website cookies.",
            webRequestTooltip: "Permission to monitor and analyze web requests.",
            webRequestBlockingTooltip: "Permission to block or modify web requests.",
            contextMenusTooltip: "Permission to add items to the browser's context menu.",
            downloadsOpenTooltip: "Permission to open downloaded files automatically.",
            identityTooltip: "Permission to authenticate with Firefox accounts.",
            nativeMessagingTooltip: "Permission to communicate with native applications.",
            privacyTooltip: "Permission to read and modify privacy settings.",
            
            // Additional Settings
            defaultLocalePlaceholder: "_locales/en/messages.json",
            manifestV2: "Manifest V2",
            manifestV3: "Manifest V3",
            
            // Form Placeholders
            versionPlaceholder: "1.0, 1.2.3",
            updateUrlPlaceholder: "https://example.com/updates.xml",
            homepageUrlPlaceholder: "https://example.com/extension",
            authorPlaceholder: "Name or Organization",
            minVersionPlaceholder: "42.0",
            maxVersionPlaceholder: "*",
            
            // Button Tooltips
            copyTitle: "Copy",
            downloadTitle: "Download",
            formatTitle: "Compress Format",
            themeSwitch: "Switch Theme",
            
            // Error Messages
            copyError: "Copy failed: ",
            downloadError: "Download failed",
            updateUrlTooltip: "URL where extension updates will be checked.",
            homepageUrlTooltip: "Homepage URL of the extension. Will be displayed in Firefox store.",
            authorTooltip: "Person or organization who developed the extension.",
            shortcutsTooltip: "Define keyboard shortcuts to trigger your extension. Example: Ctrl+Shift+Y",
            protocolHandlersTooltip: "Handle custom protocols (like magnet:) in your extension.",
            chromeSettingsTooltip: "Browser homepage and search provider settings.",
            descriptionTooltip: "A short description explaining what your extension does. This will be displayed in the Firefox store.",
            versionTooltip: "Version number of your extension. Example: 1.0, 1.2.3",
            popupPlaceholder: "popup/popup.html",
            scriptPlaceholder: "content/script.js",
            matchesPlaceholder: "*://*.example.com/*",
            resourcePlaceholder: "images/logo.png",
            iconPathPlaceholder: "icons/icon-{size}.png"
        }
    };

    // Dil değiştirme fonksiyonu
    function switchLanguage(lang) {
        // Tüm dil butonlarından active sınıfını kaldır
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Seçilen dil butonuna active sınıfını ekle
        document.querySelector(`.lang-btn[data-lang="${lang}"]`).classList.add('active');

        // Tüm çevrilebilir elementleri güncelle
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            if (translations[lang][key]) {
                // Input ve textarea için placeholder'ı güncelle
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[lang][key];
                } 
                // Label içindeki metin düğümünü güncelle
                else if (element.tagName === 'LABEL') {
                    // İlk metin düğümünü bul ve güncelle
                    for (let node of element.childNodes) {
                        if (node.nodeType === 3) { // Text node
                            node.nodeValue = translations[lang][key] + ':';
                            break;
                        }
                    }
                }
                // Diğer elementler için textContent'i güncelle
                else {
                    element.textContent = translations[lang][key];
                }
            }
        });

        // Tooltip metinlerini güncelle
        document.querySelectorAll('[data-tooltip-key]').forEach(element => {
            const key = element.dataset.tooltipKey;
            if (translations[lang][key]) {
                element.dataset.tooltip = translations[lang][key];
            }
        });

        // Buton metinlerini güncelle
        document.getElementById('uploadButton').textContent = translations[lang].uploadIcon;
        document.getElementById('copyBtn').textContent = translations[lang].copy;
        document.getElementById('downloadBtn').textContent = translations[lang].downloadManifest;
        document.getElementById('downloadZipBtn').textContent = translations[lang].downloadZip;

        // Dil tercihini kaydet
        localStorage.setItem('preferredLanguage', lang);

        // Placeholder'ları güncelle
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.dataset.i18nPlaceholder;
            if (translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });

        // Title attribute'larını güncelle
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.dataset.i18nTitle;
            if (translations[lang][key]) {
                element.title = translations[lang][key];
            }
        });

        // Alt attribute'larını güncelle
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            if (translations[lang][key]) {
                if (element.hasAttribute('alt')) {
                    element.alt = translations[lang][key];
                }
            }
        });

        // HTML lang attribute'unu güncelle
        document.documentElement.setAttribute('lang', lang);
    }

    // Dil butonlarına event listener ekle
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            switchLanguage(lang);
        });
    });

    // Kaydedilmiş dil tercihini al ve uygula
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    switchLanguage(savedLang);
}); 