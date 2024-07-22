
document.addEventListener('DOMContentLoaded', () => {
    const entrada = document.querySelector('.encriptador__entrada');
    const resultadoBox = document.querySelector('.resultado__box');
    const botones = document.querySelectorAll('.btn-primary');
    const alerta = document.querySelector('.resultado__alerta');
    const boxRestricciones = document.querySelector('.encriptador__restricciones');

    
    let entradaTexto = '';

    const llaves = {
        a: 'ai', 
        e: 'enter',
        i: 'imes',
        o: 'ober',
        u: 'ufat',
    }

    /* Validaciones */

    function deshabilitarBoton(boton) {
        boton.classList.add('btn-primary--deshabilitado');
        boton.disabled = true;
    };

    function habilitarBoton(boton) {
        boton.classList.remove('btn-primary--deshabilitado');
        boton.disabled = false;
    };

    function verificarRestricciones(mensaje) {
        const regex = /^[a-z0-9 ñ]*$/;
        return regex.test(mensaje);
    };

    function estilosError() {
        const ico = boxRestricciones.querySelector('img');
        ico.src = './img/bi_exclamation-circle-fill-red.svg';
        const pError = boxRestricciones.querySelector('p');
        pError.style.color = '#A82727';
    };

    function estilosErrorRemover() {
        const ico = boxRestricciones.querySelector('img');
        ico.src = './img/bi_exclamation-circle-fill.svg';
        const pError = boxRestricciones.querySelector('p');
        pError.style.color = '#fff';
    };

    function agregarAnimacionTemblor(elemento) {
        elemento.classList.add('animacion-atencion');
    }

    function removerAnimacionTemblor(elemento) {
        elemento.classList.remove('animacion-atencion');
    }

    function animacionError() {
        boxRestricciones.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
            agregarAnimacionTemblor(boxRestricciones);
            const ico = boxRestricciones.querySelector('img');
            ico.classList.add('animacion-scale-signo');
            setTimeout(() => {
                animacionErrorRemover()
            }, 1300);
        }, 100);
    };

    function animacionErrorRemover() {
        removerAnimacionTemblor(boxRestricciones);
        const ico = boxRestricciones.querySelector('img');
        ico.classList.remove('animacion-scale-signo');
    };

    function validar(e) {
        if(e.target.value.trim() === '') {
            animacionErrorRemover();
            estilosErrorRemover();
            deshabilitarBoton(botones[0]);
            deshabilitarBoton(botones[1]);
            entradaTexto = '';
            return;
        };
        const resultado = verificarRestricciones(e.target.value.trim());
        if (!resultado) {
            estilosError() 
            animacionError();
            deshabilitarBoton(botones[0])
            deshabilitarBoton(botones[1])
            return;
        }
        estilosErrorRemover();
        animacionErrorRemover();
        entradaTexto = e.target.value.trim();
        
        habilitarBoton(botones[0]);
        habilitarBoton(botones[1]);
    };

    /* Verificar si está encriptado, si lo está se desencripta, sino devuelve alerta*/

    function verificarEncriptacion() {
        const llavesArray = Object.keys(llaves);
        let i = 0;
        let tieneVocal = false;
        while(i < entradaTexto.length) {
            if (llavesArray.includes(entradaTexto[i])) { 
                tieneVocal = true;
                const subcadena = entradaTexto.slice(i, i + llaves[entradaTexto[i]].length);
                if (subcadena === llaves[entradaTexto[i]]) {
                    i += llaves[entradaTexto[i]].length;
                    continue;
                } 
                return false;
            };
            i++;
        };
        if(!tieneVocal) {
            return false;
        };
        return true;
    };

    /* Verificar necesidad de encriptacion, si tiene una vocal retorna verdadero sino retorna falso y se emite alerta */

    function requiereEncriptacion() {
        let i = 0;
        const llavesArray = Object.keys(llaves);
        while(i < entradaTexto.length) {
            if (llavesArray.includes(entradaTexto[i])) { 
                return true;
            };
            i++;
        };
        return false;
    }

    /* Encriptar */

    function encriptar() {
        removerAnimacionOk();
        if(requiereEncriptacion()) {
            let textoEncriptado = '';       
            for(let i = 0; i < entradaTexto.length; i++) {        
                if (Object.keys(llaves).includes(entradaTexto[i])) {
                    textoEncriptado += llaves[entradaTexto[i]]; 
                } else { 
                    textoEncriptado += entradaTexto[i]; 
                };
            };
            mostrarResultado(textoEncriptado);
            return;
        }; 
        mostrarNoEncriptado('El texto no requiere encriptación.', './img/ilu-no-encriptado.webp', 'translateY(9%) scale(1.4)');
        agregarAnimacionTemblor(alerta.querySelector('.resultado__alerta-mensaje span'));
        setTimeout(() => {
            removerAnimacionTemblor(alerta.querySelector('.resultado__alerta-mensaje span'));
        }, 1300); 
        console.log('El texto no requiere encriptación.');
    };

    /* Desencriptar */

    function desencriptar() {
        removerAnimacionOk();
        console.log(verificarEncriptacion());  
        if(!verificarEncriptacion()) {
            mostrarNoEncriptado('El texto no está encriptado.', './img/ilu-no-encriptado.webp', 'translateY(9%) scale(1.4)');
            agregarAnimacionTemblor(alerta.querySelector('.resultado__alerta-mensaje span'));
            setTimeout(() => {
                removerAnimacionTemblor(alerta.querySelector('.resultado__alerta-mensaje span'));
            }, 1300); 
            return;
        }
        let textoDesencriptado = '';
        const llavesArray = Object.keys(llaves);
        for(let i = 0; i < entradaTexto.length; i++) {   
            const char =  entradaTexto[i];   
            if (llavesArray.includes(char)) { 
                const subcadena = entradaTexto.slice(i, i + llaves[char].length);
                if(subcadena === llaves[char]) {   
                    textoDesencriptado += char;  
                    i += llaves[char].length - 1;  
                    continue;
                };
            }; 
            textoDesencriptado += char;
        };
        mostrarResultado(textoDesencriptado);
    };

    /* Error de mensaje no encriptado */

    function mostrarNoEncriptado(texto, url, transform ) {
        limpiarResultado();
        tituloError(texto);
        imagenError(url, transform); 
    }

    /* Mostrar resultado */

    function mostrarResultado(resultado) {
        alerta.classList.add('d-none');
        entrada.value = '';
        resultadoBox.value = resultado;
        resultadoBox.classList.remove('d-none');
        botones[2].classList.remove('d-none');
        botones[3].classList.remove('d-none');
    }


    function limpiarResultado() {
        alerta.classList.remove('d-none');
        resultadoBox.classList.add('d-none');
        botones[2].classList.add('d-none');
        botones[3].classList.add('d-none');
    }

    /* Limpar campos */

    function limpiarCampos() {
        entrada.value = '';
        entradaTexto = '';
        resultadoBox.value = '';
        limpiarResultado();
        imagenError('./img/ilu-search.webp', 'rotate(-13deg) translate(-60%, -14%) scale(1.4)');
        tituloError('Ningún mensaje fue encontrado');
        removerAnimacionOk();
        removerIconoPegar();
        animacionErrorRemover();
        estilosErrorRemover();
        deshabilitarBoton(botones[0]);
        deshabilitarBoton(botones[1]);
    };

    function tituloError(mensaje) {
        const texto = alerta.querySelector('.resultado__alerta-mensaje span');
        texto.textContent = mensaje;
    }

    function imagenError(url, transform) { 
        const imagenErrorBox = alerta.querySelector('.resultado__alerta-ilustracion');
        const imagenError = imagenErrorBox.firstElementChild;
        imagenError.src = url;
        setTimeout(() => {
            imagenErrorBox.style.transform = transform;  
        }, 10);
        
    }

    function mostrarAnimacionOk() { //Animacion ok sobre el boton copiar
        const imgOk = document.querySelector('.icono-ok');
        imgOk.classList.add('mostrar');
        setTimeout(() => {
            imgOk.classList.add('animacion-mostrar-ok');
        }, 100);
    }

    function removerAnimacionOk() { //Animacion ok sobre el boton copiar
        const imgOk = document.querySelector('.icono-ok');
        imgOk.classList.remove('mostrar');
        imgOk.classList.remove('animacion-mostrar-ok');
    }

    function mostrarIconoPegar() {
        const icoPegar = document.querySelector('.icono-pegar');
        icoPegar.style.pointerEvents = 'auto';
        icoPegar.classList.add('mostrar');
        icoPegar.addEventListener('click', () => {
            pegarCopiado();
            
        })
    }

    function removerIconoPegar() {
        const icoPegar = document.querySelector('.icono-pegar');
        icoPegar.style.pointerEvents = 'none';
        icoPegar.classList.remove('mostrar');
    }
    
    /* copiar texto */
    async function copiarResultado() {
        try {
            if(resultadoBox.value) {
                await navigator.clipboard.writeText(resultadoBox.value);
                mostrarAnimacionOk();
                setTimeout(() => {
                    mostrarIconoPegar()
                }, 600);
            };
        } catch (error) {
            console.log('el texto no pudo ser copiado en el portapapeles');
        };
    };
    

    async function pegarCopiado() {
        try {
            const texto = await navigator.clipboard.readText();
            entrada.value = texto;
            entradaTexto = texto;
            animacionErrorRemover();
            estilosErrorRemover();
        } catch (error) {
            console.log('No se pudo pegar el texto del portapapeles');
        }
    }

    deshabilitarBoton(botones[0]);
    deshabilitarBoton(botones[1]);

    entrada.addEventListener('input', (e) => {
        validar(e);
    });

    botones[0].addEventListener('click', encriptar);
    botones[1].addEventListener('click', desencriptar);
    botones[2].addEventListener('click', copiarResultado);
    botones[3].addEventListener('click', limpiarCampos);
});
