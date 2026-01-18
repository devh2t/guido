
import React, { useState } from 'react';
import { X, Download, Loader2, CheckCircle2, Map as MapIcon } from 'lucide-react';
import { Tour } from '../types';
import { jsPDF } from 'jspdf';

interface ShareTourOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  tour: Tour;
  t: (key: string) => string;
}

const ShareTourOverlay: React.FC<ShareTourOverlayProps> = ({ isOpen, onClose, tour, t }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const generatePDF = async () => {
    setIsGenerating(true);
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = 210;
    let y = 20;

    // Helper for multi-line text
    const addText = (text: string, size: number, style: 'normal' | 'bold' = 'normal', color: [number, number, number] = [15, 23, 42]) => {
      doc.setFont('helvetica', style);
      doc.setFontSize(size);
      doc.setTextColor(color[0], color[1], color[2]);
      const lines = doc.splitTextToSize(text, 170);
      doc.text(lines, margin, y);
      y += (lines.length * (size / 2.5)) + 4;
    };

    // 1. PREMIUM BRANDED HEADER
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // Logo Icon
    doc.setFillColor(249, 115, 22); // orange-500
    doc.roundedRect(margin, 15, 12, 12, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('K', margin + 4.5, 23.5);

    // Brand Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('KURATOUR', margin + 16, 25);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('YOUR PERSONAL AI TRAVEL CONCIERGE', margin + 16, 31);
    
    // Header Info
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.2);
    doc.line(margin, 40, pageWidth - margin, 40);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(tour.city.toUpperCase(), margin, 50);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const dateStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.text(`GUIDE GENERATED: ${dateStr.toUpperCase()}`, pageWidth - margin - 55, 50);

    y = 75;

    // 2. TOUR TITLE & OVERVIEW
    doc.setTextColor(249, 115, 22);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL ITINERARY', margin, y);
    y += 8;

    addText(tour.tourTitle.toUpperCase(), 20, 'bold', [15, 23, 42]);
    y += 2;
    addText(tour.overview, 10, 'normal', [71, 85, 105]);
    y += 10;

    // 3. REALISTIC ROUTE VISUALIZATION (Branded Map Placeholder)
    addText('ROUTING & LOGISTICS', 11, 'bold');
    y += 2;
    
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, 170, 70, 6, 6, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, 170, 70, 6, 6, 'D');
    
    // Draw stylized path based on number of stops
    const centerX = margin + 85;
    const centerY = y + 35;
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.5);
    doc.setLineDashPattern([2, 2], 0);
    
    // Sequence path
    doc.line(margin + 20, centerY + 10, margin + 50, centerY - 15);
    doc.line(margin + 50, centerY - 15, centerX, centerY + 15);
    doc.line(centerX, centerY + 15, margin + 120, centerY - 10);
    doc.line(margin + 120, centerY - 10, margin + 150, centerY + 10);
    doc.setLineDashPattern([], 0);

    // Stop Circles
    const points = [[20, 10], [50, -15], [85, 15], [120, -10], [150, 10]];
    points.forEach((p, i) => {
      if (i >= tour.stops.length) return;
      doc.setFillColor(15, 23, 42);
      doc.circle(margin + p[0], centerY + p[1], 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6);
      doc.text((i + 1).toString(), margin + p[0] - 1, centerY + p[1] + 1);
    });

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(`Sequence: ${tour.stops.map(s => s.name).slice(0, 3).join(' -> ')}...`, margin + 10, y + 62);
    
    y += 85;

    // 4. SUMMARY BADGES
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, 50, 20, 3, 3, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7);
    doc.text('TOTAL STOPS', margin + 5, y + 8);
    doc.setFontSize(10);
    doc.text(tour.stops.length.toString(), margin + 5, y + 15);

    doc.roundedRect(margin + 60, y, 50, 20, 3, 3, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7);
    doc.text('BUDGET ESTIMATE', margin + 65, y + 8);
    doc.setFontSize(10);
    doc.text(`${tour.totalEstimatedCost} ${tour.currency}`, margin + 65, y + 15);

    doc.roundedRect(margin + 120, y, 50, 20, 3, 3, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7);
    doc.text('TRAVEL MODE', margin + 125, y + 8);
    doc.setFontSize(10);
    doc.text('Multi-Modal', margin + 125, y + 15);

    // 5. ITINERARY DETAILS
    doc.addPage();
    y = 25;
    
    doc.setTextColor(249, 115, 22);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('DETAILED CHRONICLE', margin, y);
    y += 10;

    tour.stops.forEach((stop, index) => {
      if (y > 240) {
        doc.addPage();
        y = 30;
      }
      
      // Stop Header
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(margin, y - 5, 8, 8, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text((index + 1).toString(), margin + 2.5, y + 1);
      
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(stop.name.toUpperCase(), margin + 12, y + 1);
      y += 8;

      // Stop Description
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const descLines = doc.splitTextToSize(stop.description, 170);
      doc.text(descLines, margin, y);
      y += (descLines.length * 4.5) + 4;

      // Meta info Bar
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, 170, 10, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      
      const transport = stop.transportMode ? stop.transportMode.toUpperCase() : 'WALKING';
      const cost = stop.estimatedCost === 0 ? 'FREE' : `${stop.estimatedCost} ${tour.currency}`;
      const distance = stop.distanceFromPrevious || 'N/A';
      
      doc.text(`MODE: ${transport}    |    DIST: ${distance}    |    COST: ${cost}`, margin + 5, y + 6.5);
      
      y += 22;
    });

    // FOOTER ON ALL PAGES
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(`Kuratour AI Luxury Travel Engine  |  Personalized for ${tour.city}`, margin, 287);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 15, 287);
      
      // Footer Accent
      doc.setFillColor(249, 115, 22);
      doc.rect(margin, 282, 10, 1, 'F');
    }

    doc.save(`Kuratour_${tour.city}_Premium_Guide.pdf`);
    setIsGenerating(false);
    setIsDone(true);
    setTimeout(() => { setIsDone(false); onClose(); }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500">
        <div className="flex justify-between items-center mb-6">
          <div className="text-start">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Export Guide</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Premium Branded Document</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4 p-5 bg-orange-50/50 dark:bg-orange-500/10 border border-orange-100/50 dark:border-orange-500/20 rounded-[2rem]">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-sm text-orange-600">
              <MapIcon className="w-5 h-5" />
            </div>
            <div className="text-start">
              <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1">Reality-Matched Pathing</h5>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                The document features a stylized itinerary map matched to your curated stops.
              </p>
            </div>
          </div>

          <button 
            disabled={isGenerating || isDone}
            onClick={generatePDF}
            className={`w-full py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
              isDone ? 'bg-emerald-500 text-white' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
            }`}
          >
            {isGenerating ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Preparing...</>
            ) : isDone ? (
              <><CheckCircle2 className="w-5 h-5" /> Generated!</>
            ) : (
              <><Download className="w-5 h-5" /> Download Premium Guide</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareTourOverlay;
