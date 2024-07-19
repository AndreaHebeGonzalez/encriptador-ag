
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

    let estaEncriptado = false;

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

    function animacionError() {
        boxRestricciones.scrollIntoView({ behavior: 'smooth', block: 'end' });
        setTimeout(() => {
            boxRestricciones.classList.add('animacion-atencion');
            const ico = boxRestricciones.querySelector('img');
            ico.classList.add('animacion-scale-signo');
            setTimeout(() => {
                animacionErrorRemover()
            }, 1300);
        }, 100);
    };

    function animacionErrorRemover() {
        boxRestricciones.classList.remove('animacion-atencion');
        const ico = boxRestricciones.querySelector('img');
        ico.classList.remove('animacion-scale-signo');
    };

    function validar(e) {
        if(e.target.value.trim() === '') {
            animacionErrorRemover();
            estilosErrorRemover();
            deshabilitarBoton(botones[0]);
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
        verificarEncriptacion();
        if(estaEncriptado) {
            habilitarBoton(botones[1]);
        }
    };

    /* Encriptar */

    function encriptar() {
        let textoEncriptado = '';       
        for(let i = 0; i < entradaTexto.length; i++) {        
            if (Object.keys(llaves).includes(entradaTexto[i])) {
                textoEncriptado += llaves[entradaTexto[i]]; 
            } else { 
                textoEncriptado += entradaTexto[i]; 
            };
        };
        console.log(textoEncriptado);
        mostrarResultado(textoEncriptado);
    };

    /* Verificar si está encriptado */

    function verificarEncriptacion() {
        let i = 0;
        while(i < entradaTexto.length) {
            if (Object.keys(llaves).includes(entradaTexto[i])) { 
                if (entradaTexto.slice(i, i + llaves[entradaTexto[i]].length) === llaves[entradaTexto[i]]) {
                    estaEncriptado = true;
                    console.log(entradaTexto)
                    console.log(entradaTexto.slice(i, i + llaves[entradaTexto[i]].length) === llaves[entradaTexto[i]])
                    i += llaves[entradaTexto[i]].length;
                    continue;
                } 
                estaEncriptado = false;
                return;
            };
            i++;
        };
        return; 
    }

    /* Desencriptar */

    function desencriptar() {
        let textoDesencriptado = '';  
        verificarEncriptacion();
        console.log(estaEncriptado);
        if(estaEncriptado) {
            for(let i = 0; i < entradaTexto.length; i++) {       
                if (Object.keys(llaves).includes(entradaTexto[i])) { 
                    const valor = entradaTexto.slice(i, i + llaves[entradaTexto[i]].length);
                    if(valor === llaves[entradaTexto[i]]) {   
                        textoDesencriptado += entradaTexto[i];  
                        i += llaves[entradaTexto[i]].length - 1;  
                    } else {
                        textoDesencriptado += entradaTexto[i];
                    };
                } else { 
                    textoDesencriptado += entradaTexto[i];
                };
            };
        } else {
            mostrarResultado('El texto no está encriptado, por favor ingrese un texto encriptado');
            return;
        }
        mostrarResultado(textoDesencriptado);
    };

    /* Imprimir resultado */

    function mostrarResultado(resultado) {
        if (resultado) {
            alerta.classList.add('d-none');
            resultadoBox.value = resultado;
            resultadoBox.classList.remove('d-none');
            botones[2].classList.remove('d-none');
        }

    }

    
    deshabilitarBoton(botones[0]);
    deshabilitarBoton(botones[1]);

    entrada.addEventListener('input', (e) => {
        validar(e);
    });

    botones[0].addEventListener('click', encriptar);
    botones[1].addEventListener('click', desencriptar);
});
