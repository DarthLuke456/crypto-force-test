'use client';

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  theme?: 'dark' | 'light';
  height?: number;
}

export default function TradingViewChart({ 
  symbol = 'BTCUSD', 
  interval = '1D', 
  theme = 'dark',
  height = 400 
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const containerId = useRef(`tradingview-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Cargar el script de TradingView si no está disponible
    if (!window.TradingView) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = createWidget;
      document.head.appendChild(script);
    } else {
      createWidget();
    }

    return () => {
      // Cleanup seguro del widget
      if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
        try {
          widgetRef.current.remove();
        } catch (error) {
          console.warn('Error al eliminar widget TradingView:', error);
        }
        widgetRef.current = null;
      }
    };
  }, [symbol, interval, theme, height]);

  const createWidget = () => {
    if (!containerRef.current || !window.TradingView) return;

    try {
      // Limpiar el contenedor de forma segura
      if (containerRef.current && containerRef.current.innerHTML !== '') {
        containerRef.current.innerHTML = '';
      }

      // Verificar que el contenedor sigue siendo válido
      if (!containerRef.current || !document.contains(containerRef.current)) {
        console.warn('Contenedor TradingView no válido');
        return;
      }

      // Crear el widget con configuración limpia - solo precio, sin indicadores
      widgetRef.current = new window.TradingView.widget({
        symbol: symbol,
        interval: interval,
        timezone: 'America/New_York',
        theme: theme,
        style: '1',
        locale: 'es',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: containerRef.current.id,
        width: '100%',
        height: height,
        studies: [], // Sin indicadores por defecto
        disabled_features: [
          'use_localstorage_for_settings',
          'create_volume_indicator_by_default', // Deshabilitar volumen por defecto
          'volume_force_overlay', // Deshabilitar overlay de volumen
          'show_volume_scale', // Ocultar escala de volumen
          'header_symbol_search', // Deshabilitar búsqueda de símbolos
          'header_compare', // Deshabilitar comparación
          'header_settings', // Deshabilitar configuración
          'header_indicators', // Deshabilitar indicadores
          'header_fullscreen_button', // Deshabilitar botón pantalla completa
          'timeframes_toolbar', // Deshabilitar barra de timeframes
          'header_saveload', // Deshabilitar guardar/cargar
          'control_bar', // Deshabilitar barra de control
          'countdown', // Deshabilitar countdown
          'display_market_status', // Deshabilitar estado del mercado
          'chart_property_page', // Deshabilitar página de propiedades
          'go_to_date', // Deshabilitar ir a fecha
          'symbol_info', // Deshabilitar información del símbolo
          'chart_crosshair_menu', // Deshabilitar menú de crosshair
          'high_density_bars', // Deshabilitar barras de alta densidad
          'left_toolbar', // Deshabilitar barra de herramientas izquierda
          'legend_widget', // Deshabilitar widget de leyenda
          'overlay_price_scale', // Deshabilitar escala de precio superpuesta
          'pane_legend', // Deshabilitar leyenda del panel
          'popup_hints', // Deshabilitar pistas emergentes
          'scale_series_only', // Deshabilitar escala solo para series
          'scrolling_on_touch', // Deshabilitar scroll táctil
          'show_chart_property_page', // Deshabilitar mostrar página de propiedades
          'show_interval_dialog_on_key_press', // Deshabilitar diálogo de intervalo
          'show_logo_on_all_charts', // Deshabilitar logo en todos los gráficos
          'show_symbol_logo', // Deshabilitar logo del símbolo
          'support_multicharts', // Deshabilitar soporte para múltiples gráficos
          'use_localstorage_for_chart_properties' // Deshabilitar localStorage para propiedades
        ],
        enabled_features: [
          'study_templates',
          'side_toolbar_in_fullscreen_mode',
          'edit_buttons_in_legend',
          'context_menus',
          'border_around_the_chart'
        ],
        overrides: {
          'mainSeriesProperties.candleStyle.upColor': '#3ED598',
          'mainSeriesProperties.candleStyle.downColor': '#ec4d58',
          'mainSeriesProperties.candleStyle.wickUpColor': '#3ED598',
          'mainSeriesProperties.candleStyle.wickDownColor': '#ec4d58',
          'mainSeriesProperties.candleStyle.borderUpColor': '#3ED598',
          'mainSeriesProperties.candleStyle.borderDownColor': '#ec4d58'
        },
        loading_screen: {
          backgroundColor: '#0f0f0f',
          foregroundColor: '#ec4d58'
        }
      });
    } catch (error) {
      console.error('Error al crear widget TradingView:', error);
      widgetRef.current = null;
    }
  };

  return (
    <div className="w-full">
      <div 
        ref={containerRef}
        id={containerId.current}
        className="tradingview-widget-container"
      />
    </div>
  );
}
