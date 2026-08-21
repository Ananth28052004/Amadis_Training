import os
import sys
from datetime import datetime

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
    HRFlowable,
    ListFlowable,
    ListItem,
)
from reportlab.pdfgen import canvas

# Define custom Canvas for Two-Pass Page Numbering & Running Headers
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Running Header (Pages 2+)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#1E293B")) # Slate 800
            self.drawString(40, 755, "CINEBOOK — Movie Booking Management System")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B")) # Slate 500
            self.drawRightString(572, 755, "Step-by-Step Code Execution & Architecture Guide")
            self.setStrokeColor(colors.HexColor("#CBD5E1")) # Slate 300
            self.setLineWidth(0.75)
            self.line(40, 747, 572, 747)
        
        # Running Footer (All Pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.75)
        self.line(40, 42, 572, 42)
        
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#4F46E5")) # Indigo 600
        self.drawString(40, 30, "CineBook v2.0")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(105, 30, "|  Enterprise Full-Stack Architecture Documentation")
        self.drawRightString(572, 30, f"Page {self._pageNumber} of {page_count}")
        
        self.restoreState()


def create_callout(text, title="NOTE", border_color="#4F46E5", bg_color="#EEF2FF", width=532):
    """Generates a styled callout box with a colored left accent border."""
    content = [
        Paragraph(f"<b><font color='{border_color}'>{title}:</font></b> {text}", 
                  ParagraphStyle(
                      'CalloutText',
                      fontName='Helvetica',
                      fontSize=9,
                      leading=13,
                      textColor=colors.HexColor("#1E293B")
                  ))
    ]
    t = Table([[content]], colWidths=[width])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor(bg_color)),
        ('LINELEFT', (0, 0), (0, -1), 3.5, colors.HexColor(border_color)),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
    ]))
    return t


def create_code_block(code_text, language="BASH", width=532):
    """Generates a styled code snippet block with dark background."""
    formatted_code = code_text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br/>")
    # Replace spaces with non-breaking spaces for indentation
    lines = formatted_code.split("<br/>")
    processed_lines = []
    for line in lines:
        leading_spaces = len(line) - len(line.lstrip(' '))
        processed_lines.append('&nbsp;' * (leading_spaces * 2) + line.lstrip(' '))
    formatted_code = "<br/>".join(processed_lines)

    p = Paragraph(f"<font face='Courier' size=8 color='#F8FAFC'>{formatted_code}</font>", 
                  ParagraphStyle('CodeBlockStyle', leading=11))
    
    header_p = Paragraph(f"<b><font face='Helvetica-Bold' size=7 color='#94A3B8'>{language}</font></b>",
                         ParagraphStyle('CodeHeaderStyle', leading=9))
    
    t = Table([[header_p], [p]], colWidths=[width])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#0F172A")),
        ('TOPPADDING', (0, 0), (-1, 0), 4),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 2),
        ('TOPPADDING', (0, 1), (-1, 1), 2),
        ('BOTTOMPADDING', (0, 1), (-1, 1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('LINEBELOW', (0, 0), (-1, 0), 0.5, colors.HexColor("#334155")),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#1E293B")),
    ]))
    return t


def generate_guide_pdf(output_path):
    # Setup document
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=48,
        bottomMargin=48,
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    PRIMARY = "#0F172A"      # Slate 900
    INDIGO = "#4F46E5"       # Indigo 600
    VIOLET = "#7C3AED"       # Violet 600
    SLATE_TEXT = "#334155"   # Slate 700
    MUTED_TEXT = "#64748B"   # Slate 500
    BORDER_COLOR = "#CBD5E1" # Slate 300
    BG_LIGHT = "#F8FAFC"     # Slate 50
    EMERALD = "#059669"      # Emerald 600
    AMBER = "#D97706"        # Amber 600

    # Custom Typography Styles
    style_cover_title = ParagraphStyle(
        'CoverTitle',
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor(PRIMARY),
        spaceAfter=4,
    )
    style_cover_subtitle = ParagraphStyle(
        'CoverSubtitle',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor(INDIGO),
        spaceAfter=12,
    )
    style_h1 = ParagraphStyle(
        'Heading1_Custom',
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor(PRIMARY),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True,
    )
    style_h2 = ParagraphStyle(
        'Heading2_Custom',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor(INDIGO),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True,
    )
    style_h3 = ParagraphStyle(
        'Heading3_Custom',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor(VIOLET),
        spaceBefore=7,
        spaceAfter=3,
        keepWithNext=True,
    )
    style_body = ParagraphStyle(
        'Body_Custom',
        fontName='Helvetica',
        fontSize=8.8,
        leading=12.5,
        textColor=colors.HexColor(SLATE_TEXT),
        spaceAfter=5,
    )
    style_body_bold = ParagraphStyle(
        'BodyBold_Custom',
        fontName='Helvetica-Bold',
        fontSize=8.8,
        leading=12.5,
        textColor=colors.HexColor(PRIMARY),
        spaceAfter=5,
    )
    style_table_header = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=11,
        textColor=colors.white,
    )
    style_table_cell = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor(SLATE_TEXT),
    )
    style_table_cell_bold = ParagraphStyle(
        'TableCellBold',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor(PRIMARY),
    )
    style_table_cell_code = ParagraphStyle(
        'TableCellCode',
        fontName='Courier-Bold',
        fontSize=7.8,
        leading=10,
        textColor=colors.HexColor(INDIGO),
    )

    story = []

    # =========================================================================
    # DOCUMENT COVER / HERO BANNER
    # =========================================================================
    header_table_data = [
        [
            Paragraph("<b>CINEBOOK</b>", ParagraphStyle('LogoStyle', fontName='Helvetica-Bold', fontSize=22, textColor=colors.HexColor(INDIGO))),
            Paragraph("<b>FULL-STACK ENGINEERING GUIDE</b><br/><font size=8 color='#64748B'>Fastify 5 • PostgreSQL 16 • React 19 • TypeScript</font>", 
                      ParagraphStyle('HeaderRight', fontName='Helvetica', fontSize=9, leading=12, alignment=2, textColor=colors.HexColor(PRIMARY)))
        ]
    ]
    header_table = Table(header_table_data, colWidths=[200, 332])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor(INDIGO), spaceBefore=4, spaceAfter=8))
    
    story.append(Paragraph("Movie Booking Management System", style_cover_title))
    story.append(Paragraph("Complete Step-by-Step Code Execution & Codebase Architecture Guide", style_cover_subtitle))
    story.append(Paragraph(
        "This engineering handbook provides a complete walkthrough of the CineBook platform. It explains "
        "<b>exactly how to configure and run the backend and frontend</b>, details the <b>underlying execution lifecycle</b>, "
        "and walks step-by-step through every database model, controller, service, middleware, and user interface component.",
        style_body
    ))
    story.append(Spacer(1, 4))

    # Meta Info Cards
    meta_data = [
        [
            Paragraph("<b>System Core:</b> Fastify 5 (Node.js/TS)", style_table_cell),
            Paragraph("<b>Database:</b> PostgreSQL 16 (Sequelize ORM)", style_table_cell),
            Paragraph("<b>Frontend:</b> React 19 + TanStack Router", style_table_cell),
        ],
        [
            Paragraph("<b>Auth Model:</b> Stateless JWT (@fastify/jwt)", style_table_cell),
            Paragraph("<b>Concurrency:</b> Row Locks (<code>SELECT FOR UPDATE</code>)", style_table_cell),
            Paragraph("<b>Styling:</b> TailwindCSS + Glassmorphism", style_table_cell),
        ]
    ]
    meta_table = Table(meta_data, colWidths=[177, 177, 178])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor(BG_LIGHT)),
        ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor(BORDER_COLOR)),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor(BORDER_COLOR)),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECTION 1: HOW TO RUN THE CODE STEP-BY-STEP
    # =========================================================================
    story.append(Paragraph("1. Step-by-Step Guide: How to Run the System", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor(BORDER_COLOR), spaceBefore=2, spaceAfter=6))
    
    story.append(Paragraph(
        "Follow these structured steps in sequence to boot the PostgreSQL database, seed initial data, launch the Fastify backend API, and start the React client.",
        style_body
    ))

    # Step 1: Prerequisites
    story.append(Paragraph("Step 1.1: Verify System Prerequisites", style_h2))
    story.append(Paragraph(
        "Ensure Node.js (v18 or higher), npm (v9+), and PostgreSQL (v14+) are installed and accessible in your system terminal path.",
        style_body
    ))
    story.append(create_code_block("node -v          # Recommended: v18.0.0 - v24.x\nnpm -v           # Recommended: v9.x - v11.x\npsql --version   # PostgreSQL 14, 15, or 16", "POWERSHELL / BASH"))
    story.append(Spacer(1, 4))

    # Step 2: Database Setup
    story.append(Paragraph("Step 1.2: PostgreSQL Database Creation & Config", style_h2))
    story.append(Paragraph(
        "Open your PostgreSQL CLI (<code>psql</code>) or pgAdmin tool and create the target database named <b><code>movie_booking</code></b>:",
        style_body
    ))
    story.append(create_code_block("CREATE DATABASE movie_booking;\n\\c movie_booking;\n-- Verify database is ready for table synchronization", "SQL / PSQL CLI"))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Review database credentials in <b><code>backend/src/config/database.ts</code></b> to ensure host, port, username, and password match your local environment:",
        style_body
    ))
    story.append(create_code_block(
        "// File: backend/src/config/database.ts\n"
        "import { Sequelize } from \"sequelize\";\n\n"
        "const sequelize = new Sequelize(\"movie_booking\", \"postgres\", \"Ananth@24\", {\n"
        "  host: \"localhost\",\n"
        "  port: 5432,\n"
        "  dialect: \"postgres\",\n"
        "  logging: false, // Set to console.log for SQL debug queries\n"
        "});\n"
        "export default sequelize;",
        "TYPESCRIPT (DATABASE CONFIG)"
    ))
    story.append(Spacer(1, 4))

    # Step 3: Backend Execution
    story.append(Paragraph("Step 1.3: Backend Initialization & Startup Flow", style_h2))
    story.append(Paragraph(
        "Navigate to the <code>backend</code> folder, install dependencies, seed the initial dataset, and launch the dev server:",
        style_body
    ))
    story.append(create_code_block(
        "# 1. Navigate to backend directory\n"
        "cd backend\n\n"
        "# 2. Install backend dependencies (Fastify, Sequelize, pg, @fastify/jwt, @fastify/cors)\n"
        "npm install\n\n"
        "# 3. Seed verified database records (Users, Theaters, Movies, Shows, Seat Maps)\n"
        "npm run seed\n\n"
        "# 4. Launch backend development server on Port 5050\n"
        "npm run dev",
        "POWERSHELL / TERMINAL 1"
    ))
    story.append(Spacer(1, 4))

    story.append(create_callout(
        "<b>What happens during <code>npm run seed</code>?</b><br/>"
        "1. Authenticates database connection with PostgreSQL.<br/>"
        "2. Executes <code>sequelize.sync({ alter: true })</code> to create tables with foreign key constraints.<br/>"
        "3. Inserts default Admin (<code>admin@cinebook.com</code>) and User (<code>user@cinebook.com</code>).<br/>"
        "4. Creates 3 Theaters with configured seat capacities (60, 80, 40 seats).<br/>"
        "5. Adds 4 blockbuster movies (Oppenheimer, Interstellar, Dune 2, The Dark Knight).<br/>"
        "6. Schedules upcoming showtimes and calls <code>ensureSeatsForShow()</code> to generate all numbered seats.",
        "AUTOMATED SEEDING LIFECYCLE",
        border_color=EMERALD,
        bg_color="#ECFDF5"
    ))
    story.append(Spacer(1, 6))

    # Step 4: Frontend Execution
    story.append(Paragraph("Step 1.4: Frontend Client Installation & Startup", style_h2))
    story.append(Paragraph(
        "Open a <b>second terminal window</b>, navigate to the <code>frontend</code> folder, and boot the Vite development server:",
        style_body
    ))
    story.append(create_code_block(
        "# 1. Navigate to frontend directory in a separate terminal\n"
        "cd frontend\n\n"
        "# 2. Install React 19, TanStack Router, TailwindCSS, Axios, Lucide Icons\n"
        "npm install\n\n"
        "# 3. Start Vite Development Server with Hot Module Replacement (HMR)\n"
        "npm run dev\n\n"
        "# Output: VITE v8.x  ready in ~200 ms\n"
        "# Local:   http://localhost:5173/",
        "POWERSHELL / TERMINAL 2"
    ))
    story.append(Spacer(1, 4))

    # Step 5: Verification & Credentials
    story.append(Paragraph("Step 1.5: Pre-Configured Credentials & Health Check", style_h2))
    
    cred_table_data = [
        [
            Paragraph("<b>Role</b>", style_table_header),
            Paragraph("<b>Email</b>", style_table_header),
            Paragraph("<b>Password</b>", style_table_header),
            Paragraph("<b>Access & Permissions</b>", style_table_header),
        ],
        [
            Paragraph("<b>Admin</b>", style_table_cell_bold),
            Paragraph("admin@cinebook.com", style_table_cell_code),
            Paragraph("Admin@123", style_table_cell_code),
            Paragraph("Full Control: Dashboard analytics, manage movies, theaters, shows, and all bookings.", style_table_cell),
        ],
        [
            Paragraph("<b>Customer</b>", style_table_cell_bold),
            Paragraph("user@cinebook.com", style_table_cell_code),
            Paragraph("User@123", style_table_cell_code),
            Paragraph("Client Portal: Browse catalog, interactive seat selection, e-tickets, self-cancellation.", style_table_cell),
        ],
    ]
    cred_table = Table(cred_table_data, colWidths=[70, 140, 95, 227])
    cred_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor(INDIGO)),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor(BG_LIGHT)]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor(BORDER_COLOR)),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(cred_table)
    story.append(Spacer(1, 6))

    story.append(create_callout(
        "<b>API Health Verification:</b> Open your browser or curl: <code>http://localhost:5050/api/health</code>. "
        "It returns <code>{\"ok\": true, \"service\": \"cinebook-backend\"}</code> confirming active API communication.",
        "VERIFICATION CHECK",
        border_color=INDIGO,
        bg_color="#EEF2FF"
    ))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 2: ARCHITECTURE & CODEBASE FILE MAP
    # =========================================================================
    story.append(Paragraph("2. Full Codebase Architecture & File Hierarchy", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor(BORDER_COLOR), spaceBefore=2, spaceAfter=6))
    
    story.append(Paragraph(
        "CineBook is organized into strict architectural boundaries ensuring clean separation of concerns, high maintainability, and end-to-end TypeScript type safety.",
        style_body
    ))

    arch_layers_data = [
        [
            Paragraph("<b>Architectural Layer</b>", style_table_header),
            Paragraph("<b>Core Technologies</b>", style_table_header),
            Paragraph("<b>Responsibilities & Flow</b>", style_table_header),
        ],
        [
            Paragraph("<b>Presentation Layer</b><br/><font size=7 color='#64748B'>Client (SPA)</font>", style_table_cell_bold),
            Paragraph("React 19, TypeScript,<br/>TanStack Router, TailwindCSS,<br/>Lucide Icons, Axios", style_table_cell),
            Paragraph("Renders responsive UI, captures user actions, performs client-side validation, handles JWT persistence in localStorage, and manages seat selection state.", style_table_cell),
        ],
        [
            Paragraph("<b>API & Routing Layer</b><br/><font size=7 color='#64748B'>Server / Gateway</font>", style_table_cell_bold),
            Paragraph("Fastify 5, @fastify/cors,<br/>@fastify/jwt", style_table_cell),
            Paragraph("High-throughput HTTP request dispatching, CORS headers enforcement, route prefixing, and payload parsing with low-overhead JSON serialization.", style_table_cell),
        ],
        [
            Paragraph("<b>Security & Middleware</b><br/><font size=7 color='#64748B'>Auth Guards</font>", style_table_cell_bold),
            Paragraph("JWT Verification,<br/>Role-Based Guards", style_table_cell),
            Paragraph("Validates Bearer tokens on protected endpoints (`authenticate`) and restricts administrative endpoints to users with `role === 'admin'` (`adminOnly`).", style_table_cell),
        ],
        [
            Paragraph("<b>Controllers & Services</b><br/><font size=7 color='#64748B'>Business Logic</font>", style_table_cell_bold),
            Paragraph("TypeScript Controllers,<br/><code>seatService.ts</code>", style_table_cell),
            Paragraph("Orchestrates ACID transactions, enforces PostgreSQL row-level locking (`SELECT ... FOR UPDATE`), computes seat maps, and calculates revenue metrics.", style_table_cell),
        ],
        [
            Paragraph("<b>ORM & Database Layer</b><br/><font size=7 color='#64748B'>Data Persistence</font>", style_table_cell_bold),
            Paragraph("Sequelize 6, PostgreSQL 16,<br/>Connection Pooling", style_table_cell),
            Paragraph("Executes parameterized SQL queries, enforces foreign keys, cascades on delete, tracks timestamps (`createdAt`, `updatedAt`), and handles MVCC isolation.", style_table_cell),
        ],
    ]
    arch_table = Table(arch_layers_data, colWidths=[120, 130, 282])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor(PRIMARY)),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor(BG_LIGHT)]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor(BORDER_COLOR)),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("Directory Tree & Source Code Mapping", style_h2))
    story.append(create_code_block(
        "MovieBookingManagementSystem/\n"
        "├── backend/\n"
        "│   ├── src/\n"
        "│   │   ├── config/database.ts        # Sequelize PostgreSQL connection & pool config\n"
        "│   │   ├── models/                   # Relational database schema definitions\n"
        "│   │   │   ├── User.ts               # User identity & roles ('admin' | 'user')\n"
        "│   │   │   ├── Movie.ts              # Movie catalog details, duration & poster URLs\n"
        "│   │   │   ├── Theater.ts            # Venues, locations, and total seat capacity\n"
        "│   │   │   ├── Show.ts               # Movie screenings linked to Theaters & Dates\n"
        "│   │   │   ├── Seat.ts               # Show seat status ('available' | 'booked')\n"
        "│   │   │   ├── Booking.ts            # Ticket reservations with confirm/cancel states\n"
        "│   │   │   └── associations.ts       # Model foreign keys and relationship joins\n"
        "│   │   ├── middleware/\n"
        "│   │   │   └── authMiddleware.ts     # JWT validation and Admin role guard\n"
        "│   │   ├── services/\n"
        "│   │   │   └── seatService.ts        # Dynamic seat generation & self-repair engine\n"
        "│   │   ├── controllers/              # Request handling & transaction coordination\n"
        "│   │   │   ├── authController.ts     # User registration & JWT authentication\n"
        "│   │   │   ├── bookingController.ts  # Row-locking checkout, cancellation & metrics\n"
        "│   │   │   ├── movieController.ts    # Movie CRUD operations\n"
        "│   │   │   ├── theaterController.ts  # Theater CRUD operations\n"
        "│   │   │   ├── showController.ts     # Show scheduling & seat trigger\n"
        "│   │   │   ├── seatController.ts     # Seat layout query & repair routes\n"
        "│   │   │   └── adminController.ts    # Dashboard metric aggregations\n"
        "│   │   ├── routes/                   # Fastify endpoint prefix registrations\n"
        "│   │   ├── server.ts                 # Fastify app instantiation & DB startup\n"
        "│   │   └── seed.ts                   # Automated database seeder script\n"
        "├── frontend/\n"
        "│   ├── src/\n"
        "│   │   ├── components/Navbar.tsx     # Adaptive header for Guest, User, and Admin\n"
        "│   │   ├── pages/                    # React page views & interaction workflows\n"
        "│   │   │   ├── Home.tsx              # Hero showcase & trending movies grid\n"
        "│   │   │   ├── Movies.tsx            # Live search, genre filtering & sorting\n"
        "│   │   │   ├── MovieDetails.tsx      # Movie synopsis & upcoming showtime selector\n"
        "│   │   │   ├── SeatSelection.tsx     # Interactive SVG curved cinema seat map\n"
        "│   │   │   ├── BookingConfirmation.tsx# Printable digital tear-away e-ticket\n"
        "│   │   │   ├── MyBookings.tsx         # User booking history & instant self-cancellation\n"
        "│   │   │   ├── AdminDashboard.tsx    # Live metric cards & revenue aggregation\n"
        "│   │   │   ├── AdminMovies.tsx       # Movie creation, editing & removal modal\n"
        "│   │   │   ├── AdminTheaters.tsx     # Venue capacity management\n"
        "│   │   │   ├── AdminShows.tsx        # Show scheduling & seat regeneration\n"
        "│   │   │   └── AdminBookings.tsx     # Global booking search, filters & admin overrides\n"
        "│   │   ├── router.tsx                # TanStack Router type-safe route tree\n"
        "│   │   └── main.tsx                  # Root DOM mounting & provider bootstrap",
        "SYSTEM DIRECTORY TREE"
    ))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 3: STEP-BY-STEP CODE EXPLANATION (FILE-BY-FILE)
    # =========================================================================
    story.append(Paragraph("3. Detailed Step-by-Step Codebase Walkthrough", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor(BORDER_COLOR), spaceBefore=2, spaceAfter=6))
    
    story.append(Paragraph(
        "This section deconstructs every key file in the codebase, explaining the logic, architecture, algorithms, and design choices.",
        style_body
    ))

    # 3.1 Server.ts
    story.append(Paragraph("3.1 Core Server Engine (`backend/src/server.ts`)", style_h2))
    story.append(Paragraph(
        "The server file initializes the Fastify application, registers essential plugins, establishes the PostgreSQL connection, and mounts modular REST routes.",
        style_body
    ))
    story.append(create_code_block(
        "// 1. Initialize Fastify with structured logging\n"
        "const app = Fastify({ logger: true });\n\n"
        "// 2. Register Cross-Origin Resource Sharing (CORS) to allow React client communication\n"
        "app.register(cors, {\n"
        "  origin: true,\n"
        "  methods: [\"GET\", \"POST\", \"PUT\", \"PATCH\", \"DELETE\", \"OPTIONS\"],\n"
        "  allowedHeaders: [\"Content-Type\", \"Authorization\"],\n"
        "});\n\n"
        "// 3. Register JWT Plugin for stateless token authentication\n"
        "app.register(jwt, { secret: \"movie-booking-secret-key-change-this-later\" });\n\n"
        "// 4. Register Modular Route Prefixes\n"
        "app.register(authRoutes, { prefix: \"/api/auth\" });\n"
        "app.register(movieRoutes, { prefix: \"/api/movies\" });\n"
        "app.register(theaterRoutes, { prefix: \"/api/theaters\" });\n"
        "app.register(showRoutes, { prefix: \"/api/shows\" });\n"
        "app.register(seatRoutes, { prefix: \"/api/seats\" });\n"
        "app.register(bookingRoutes, { prefix: \"/api/bookings\" });\n\n"
        "// 5. Connect to PostgreSQL and Synchronize Schema\n"
        "const start = async () => {\n"
        "  await sequelize.authenticate();\n"
        "  await sequelize.sync({ alter: true }); // Sync models to DB schema\n"
        "  await app.listen({ port: 5050, host: \"0.0.0.0\" });\n"
        "  console.log(\"🚀 Server running on http://localhost:5050\");\n"
        "};",
        "TYPESCRIPT (server.ts EXCERPT)"
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Key Technical Takeaways:</b><br/>"
        "• <b>Fastify vs. Express:</b> Fastify utilizes an advanced asynchronous architecture delivering over 30,000 req/sec with minimal overhead.<br/>"
        "• <b><code>sequelize.sync({ alter: true })</code>:</b> Ensures table schemas, indexes, and column types are safely updated without dropping existing operational data.<br/>"
        "• <b><code>0.0.0.0</code> Host Binding:</b> Guarantees the server accepts incoming connections across localhost, Docker containers, and local LAN environments.",
        style_body
    ))
    story.append(Spacer(1, 6))

    # 3.2 Database Models & Associations
    story.append(Paragraph("3.2 Relational Data Modeling (`models/*.ts` & `associations.ts`)", style_h2))
    story.append(Paragraph(
        "CineBook enforces strict relational integrity with foreign keys and cascading updates across 6 core entities:",
        style_body
    ))

    model_table_data = [
        [
            Paragraph("<b>Model</b>", style_table_header),
            Paragraph("<b>Primary Attributes</b>", style_table_header),
            Paragraph("<b>Relationships & Integrity Constraints</b>", style_table_header),
        ],
        [
            Paragraph("<b>User</b>", style_table_cell_bold),
            Paragraph("<code>id, name, email (UK), password, role ('user'|'admin')</code>", style_table_cell),
            Paragraph("<code>User.hasMany(Booking)</code> • Foreign key <code>userId</code> on Booking.", style_table_cell),
        ],
        [
            Paragraph("<b>Movie</b>", style_table_cell_bold),
            Paragraph("<code>id, title, genre, description, duration, rating, image</code>", style_table_cell),
            Paragraph("<code>Movie.hasMany(Show)</code> • Foreign key <code>movieId</code> on Show.", style_table_cell),
        ],
        [
            Paragraph("<b>Theater</b>", style_table_cell_bold),
            Paragraph("<code>id, name, location, totalSeats</code>", style_table_cell),
            Paragraph("<code>Theater.hasMany(Show)</code> • Foreign key <code>theaterId</code> on Show.", style_table_cell),
        ],
        [
            Paragraph("<b>Show</b>", style_table_cell_bold),
            Paragraph("<code>id, movieId, theaterId, showTime, price</code>", style_table_cell),
            Paragraph("<code>Show.belongsTo(Movie)</code>, <code>Show.belongsTo(Theater)</code>, <code>Show.hasMany(Seat)</code>, <code>Show.hasMany(Booking)</code>.", style_table_cell),
        ],
        [
            Paragraph("<b>Seat</b>", style_table_cell_bold),
            Paragraph("<code>id, showId, seatNumber, status ('available'|'booked')</code>", style_table_cell),
            Paragraph("<code>Seat.belongsTo(Show)</code>, <code>Seat.hasMany(Booking)</code> • Unique per <code>(showId, seatNumber)</code>.", style_table_cell),
        ],
        [
            Paragraph("<b>Booking</b>", style_table_cell_bold),
            Paragraph("<code>id, userId, showId, seatId, status ('confirmed'|'cancelled')</code>", style_table_cell),
            Paragraph("<code>Booking.belongsTo(User)</code>, <code>Booking.belongsTo(Show)</code>, <code>Booking.belongsTo(Seat)</code>.", style_table_cell),
        ],
    ]
    model_table = Table(model_table_data, colWidths=[65, 170, 297])
    model_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor(INDIGO)),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor(BG_LIGHT)]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor(BORDER_COLOR)),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(model_table)
    story.append(Spacer(1, 6))

    # 3.3 Dynamic Seat Service
    story.append(Paragraph("3.3 Dynamic Seat Generation Engine (`services/seatService.ts`)", style_h2))
    story.append(Paragraph(
        "A common point of failure in cinema applications is missing or ungenerated seat records. CineBook resolves this via <b><code>ensureSeatsForShow()</code></b>, an idempotent service that synchronizes seat layouts dynamically:",
        style_body
    ))
    story.append(create_code_block(
        "export async function ensureSeatsForShow(showId: number, transaction?: Transaction) {\n"
        "  // 1. Fetch Show and target Theater by direct Foreign Key\n"
        "  const show = await Show.findByPk(showId, { transaction });\n"
        "  if (!show) throw new Error(\"SHOW_NOT_FOUND\");\n"
        "  const theater = await Theater.findByPk(show.theaterId, { transaction });\n\n"
        "  // 2. Resolve capacity (defaults to theater.totalSeats or 100)\n"
        "  const capacity = await resolveCapacity(theater, showId, transaction);\n\n"
        "  // 3. Find existing seats for this show\n"
        "  const existingSeats = await Seat.findAll({ where: { showId }, transaction });\n"
        "  const existingNumbers = new Set(existingSeats.map((s) => String(s.seatNumber)));\n\n"
        "  // 4. Compute missing seats and bulk insert with duplicate protection\n"
        "  const missingSeats = [];\n"
        "  for (let num = 1; num <= capacity; num++) {\n"
        "    if (!existingNumbers.has(String(num))) {\n"
        "      missingSeats.push({ showId, seatNumber: String(num), status: \"available\" });\n"
        "    }\n"
        "  }\n"
        "  if (missingSeats.length > 0) {\n"
        "    await Seat.bulkCreate(missingSeats, { transaction, ignoreDuplicates: true });\n"
        "  }\n"
        "  return { show, theater, seats: await Seat.findAll({ where: { showId }, transaction }) };\n"
        "}",
        "TYPESCRIPT (services/seatService.ts EXCERPT)"
    ))

    story.append(PageBreak())

    # 3.4 Concurrency Control & Row Locking
    story.append(Paragraph("3.4 Concurrency Control & Row Locking (`controllers/bookingController.ts`)", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor(BORDER_COLOR), spaceBefore=2, spaceAfter=6))
    
    story.append(Paragraph(
        "The centerpiece of CineBook's backend architecture is its <b>atomic, race-condition-proof booking transaction</b>. "
        "When high-demand tickets release, multiple customers often attempt to book the exact same seat simultaneously. "
        "CineBook utilizes <b>PostgreSQL Row-Level Locking (<code>SELECT ... FOR UPDATE</code>)</b> inside an explicit database transaction.",
        style_body
    ))

    story.append(create_code_block(
        "export const createBooking = async (request: FastifyRequest, reply: FastifyReply) => {\n"
        "  let transaction: Transaction | null = null;\n"
        "  try {\n"
        "    const { showId, seatIds } = request.body;\n"
        "    const userId = request.user.id;\n\n"
        "    // Step 1: Ensure seat map integrity before locking\n"
        "    await ensureSeatsForShow(showId);\n\n"
        "    // Step 2: BEGIN TRANSACTION with READ COMMITTED Isolation\n"
        "    transaction = await sequelize.transaction({\n"
        "      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,\n"
        "    });\n\n"
        "    // Step 3: EXCLUSIVE ROW LOCK (SELECT ... FOR UPDATE)\n"
        "    // Subsequent concurrent requests for these seat IDs are held by PostgreSQL\n"
        "    const seats = await Seat.findAll({\n"
        "      where: { id: seatIds, showId },\n"
        "      transaction,\n"
        "      lock: Transaction.LOCK.UPDATE, // Generates SQL 'FOR UPDATE'\n"
        "      order: [[\"id\", \"ASC\"]], // Prevents database deadlocks\n"
        "    });\n\n"
        "    // Step 4: Verify seat status. If ANY seat is already booked, ROLLBACK\n"
        "    const alreadyBooked = seats.filter((s) => s.status === \"booked\");\n"
        "    if (alreadyBooked.length > 0) {\n"
        "      await transaction.rollback();\n"
        "      return reply.code(409).send({ message: \"One or more selected seats are already booked.\" });\n"
        "    }\n\n"
        "    // Step 5: ATOMIC WRITE - Create Bookings & Mark Seats as 'booked'\n"
        "    const createdBookings = [];\n"
        "    for (const seat of seats) {\n"
        "      const b = await Booking.create({ userId, showId, seatId: seat.id, status: \"confirmed\" }, { transaction });\n"
        "      await seat.update({ status: \"booked\" }, { transaction });\n"
        "      createdBookings.push(b);\n"
        "    }\n\n"
        "    // Step 6: COMMIT TRANSACTION\n"
        "    await transaction.commit();\n"
        "    return reply.code(201).send({ message: \"Booking successful\", bookings: createdBookings });\n"
        "  } catch (error) {\n"
        "    if (transaction) await transaction.rollback();\n"
        "    return reply.code(500).send({ message: \"Booking transaction failed\" });\n"
        "  }\n"
        "};",
        "TYPESCRIPT (CONCURRENCY LOCKING IN bookingController.ts)"
    ))
    story.append(Spacer(1, 4))

    story.append(create_callout(
        "<b>Why <code>order: [['id', 'ASC']]</code> is Critical:</b><br/>"
        "When two concurrent transactions lock multiple rows in opposite orders (e.g., Tx1 locks Seat 5 then 6, while Tx2 locks Seat 6 then 5), "
        "a <b>database deadlock</b> occurs. By sorting seat IDs in ascending order prior to issuing the <code>FOR UPDATE</code> lock, "
        "all transactions acquire row locks in identical sequence, eliminating deadlocks entirely.",
        "DEADLOCK PREVENTION ALGORITHM",
        border_color=AMBER,
        bg_color="#FFFBEB"
    ))
    story.append(Spacer(1, 6))

    # 3.5 Ticket Cancellation & Seat Unlocking
    story.append(Paragraph("3.5 Ticket Cancellation & Instant Seat Release (`cancelBooking`)", style_h2))
    story.append(Paragraph(
        "When a user or administrator cancels a ticket, CineBook executes an atomic status transition from <code>confirmed</code> to <code>cancelled</code> "
        "and immediately unlocks the referenced seat from <code>booked</code> back to <code>available</code> within a single transaction:",
        style_body
    ))
    story.append(create_code_block(
        "export const cancelBooking = async (request: FastifyRequest, reply: FastifyReply) => {\n"
        "  const transaction = await sequelize.transaction();\n"
        "  try {\n"
        "    const booking = await Booking.findByPk(request.params.id, { transaction });\n"
        "    if (!booking) { await transaction.rollback(); return reply.code(404).send({ message: \"Booking not found\" }); }\n\n"
        "    // Update Booking status to 'cancelled'\n"
        "    await booking.update({ status: \"cancelled\" }, { transaction });\n\n"
        "    // Immediately release the seat back to 'available'\n"
        "    const seat = await Seat.findByPk(booking.seatId, { transaction });\n"
        "    if (seat) await seat.update({ status: \"available\" }, { transaction });\n\n"
        "    await transaction.commit();\n"
        "    return reply.send({ message: \"Booking cancelled and seat released successfully\" });\n"
        "  } catch (error) {\n"
        "    await transaction.rollback();\n"
        "    return reply.code(500).send({ message: \"Cancellation failed\" });\n"
        "  }\n"
        "};",
        "TYPESCRIPT (CANCELLATION & SEAT RELEASE)"
    ))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 4: FRONTEND WORKFLOWS & REACT 19 ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("4. Frontend Architecture & User Experience", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor(BORDER_COLOR), spaceBefore=2, spaceAfter=6))
    
    story.append(Paragraph(
        "The CineBook frontend is built using <b>React 19</b>, <b>TypeScript</b>, and <b>TanStack Router</b> for declarative, type-safe client-side routing. "
        "The interface leverages TailwindCSS for dark-mode aesthetics, curved cinema screen simulations, and responsive layouts.",
        style_body
    ))

    story.append(Paragraph("4.1 Route Hierarchy (`frontend/src/router.tsx`)", style_h2))
    story.append(Paragraph(
        "All application routes are registered under a root layout containing the global adaptive <code>Navbar</code>:",
        style_body
    ))

    routes_table_data = [
        [
            Paragraph("<b>URL Path</b>", style_table_header),
            Paragraph("<b>Component View</b>", style_table_header),
            Paragraph("<b>Access Level</b>", style_table_header),
            Paragraph("<b>Key User Actions & Features</b>", style_table_header),
        ],
        [
            Paragraph("<code>/</code>", style_table_cell_code),
            Paragraph("Home", style_table_cell_bold),
            Paragraph("Public", style_table_cell),
            Paragraph("Hero billboard banner, trending movie carousel, instant search preview.", style_table_cell),
        ],
        [
            Paragraph("<code>/movies</code>", style_table_cell_code),
            Paragraph("Movies", style_table_cell_bold),
            Paragraph("Public", style_table_cell),
            Paragraph("Movie catalog with live text search, dynamic genre chips, rating & title sorting.", style_table_cell),
        ],
        [
            Paragraph("<code>/movies/$movieId</code>", style_table_cell_code),
            Paragraph("MovieDetails", style_table_cell_bold),
            Paragraph("Public", style_table_cell),
            Paragraph("High-res poster, synopsis, duration, and grouped showtime cards with venue details.", style_table_cell),
        ],
        [
            Paragraph("<code>/seats/$showId</code>", style_table_cell_code),
            Paragraph("SeatSelection", style_table_cell_bold),
            Paragraph("User Auth", style_table_cell),
            Paragraph("Curved theater screen simulation, interactive seat grid, multi-seat cart calculation.", style_table_cell),
        ],
        [
            Paragraph("<code>/booking/$bookingId</code>", style_table_cell_code),
            Paragraph("BookingConfirmation", style_table_cell_bold),
            Paragraph("User Auth", style_table_cell),
            Paragraph("Digital tear-away cinema ticket, QR code visual accent, native <code>window.print()</code>.", style_table_cell),
        ],
        [
            Paragraph("<code>/my-bookings</code>", style_table_cell_code),
            Paragraph("MyBookings", style_table_cell_bold),
            Paragraph("User Auth", style_table_cell),
            Paragraph("Customer booking ledger with status badges and instant one-click self-cancellation.", style_table_cell),
        ],
        [
            Paragraph("<code>/admin</code>", style_table_cell_code),
            Paragraph("AdminDashboard", style_table_cell_bold),
            Paragraph("Admin Role", style_table_cell),
            Paragraph("Total users, movies, theaters, scheduled shows, gross revenue (₹), and quick action tabs.", style_table_cell),
        ],
        [
            Paragraph("<code>/admin/movies</code>", style_table_cell_code),
            Paragraph("AdminMovies", style_table_cell_bold),
            Paragraph("Admin Role", style_table_cell),
            Paragraph("Create, edit, and delete movie records with runtime validation.", style_table_cell),
        ],
        [
            Paragraph("<code>/admin/theaters</code>", style_table_cell_code),
            Paragraph("AdminTheaters", style_table_cell_bold),
            Paragraph("Admin Role", style_table_cell),
            Paragraph("Venue setup and total seat capacity configuration.", style_table_cell),
        ],
        [
            Paragraph("<code>/admin/shows</code>", style_table_cell_code),
            Paragraph("AdminShows", style_table_cell_bold),
            Paragraph("Admin Role", style_table_cell),
            Paragraph("Show scheduling with automated seat map generation and repair controls.", style_table_cell),
        ],
        [
            Paragraph("<code>/admin/bookings</code>", style_table_cell_code),
            Paragraph("AdminBookings", style_table_cell_bold),
            Paragraph("Admin Role", style_table_cell),
            Paragraph("Global booking search by customer email/movie, status filter, and admin cancellation override.", style_table_cell),
        ],
    ]
    routes_table = Table(routes_table_data, colWidths=[95, 105, 62, 270])
    routes_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor(INDIGO)),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor(BG_LIGHT)]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor(BORDER_COLOR)),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(routes_table)
    story.append(Spacer(1, 6))

    # 4.2 Interactive Seat Selection Walkthrough
    story.append(Paragraph("4.2 Interactive Seat Selection Engine (`SeatSelection.tsx`)", style_h2))
    story.append(Paragraph(
        "The seat selection page simulates a real multiplex theater experience. Key technical features include:<br/>"
        "1. <b>Dynamic Visual Layout:</b> Organizes numerical seats (1 to N) into alphabetical rows (Row A, Row B, Row C...).<br/>"
        "2. <b>Real-Time State Mapping:</b><br/>"
        "&nbsp;&nbsp;&nbsp;• <font color='#10B981'><b>Green / Available:</b></font> Clickable seat. Clicking toggles seat ID into the local selection array.<br/>"
        "&nbsp;&nbsp;&nbsp;• <font color='#7C3AED'><b>Violet / Selected:</b></font> Highlighted seat in current cart. Dynamically computes total price (`count * show.price`).<br/>"
        "&nbsp;&nbsp;&nbsp;• <font color='#EF4444'><b>Red / Booked:</b></font> Disabled seat with cursor-not-allowed, preventing selection of already reserved seats.<br/>"
        "3. <b>Multi-Seat Booking Submission:</b> Dispatches <code>POST /api/bookings</code> with payload <code>{ showId, seatIds: [...] }</code>.<br/>"
        "4. <b>Conflict Handling:</b> If another user finishes checkout first, the UI catches HTTP 409 and prompts the user to refresh the map.",
        style_body
    ))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 5: COMPLETE REST API ENDPOINT SPECIFICATION
    # =========================================================================
    story.append(Paragraph("5. Complete REST API Master Reference", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor(BORDER_COLOR), spaceBefore=2, spaceAfter=6))
    
    story.append(Paragraph(
        "The CineBook backend provides 17 RESTful endpoints formatted in JSON, secured with JWT Bearer authentication headers.",
        style_body
    ))

    api_data = [
        [
            Paragraph("<b>Method & Route</b>", style_table_header),
            Paragraph("<b>Auth / Access</b>", style_table_header),
            Paragraph("<b>Request Payload</b>", style_table_header),
            Paragraph("<b>Description & Status Codes</b>", style_table_header),
        ],
        # Auth
        [
            Paragraph("<code>POST /api/auth/register</code>", style_table_cell_code),
            Paragraph("Public", style_table_cell),
            Paragraph("<code>{ name, email, password }</code>", style_table_cell),
            Paragraph("Registers new customer account. Returns 201 Created (409 on duplicate email).", style_table_cell),
        ],
        [
            Paragraph("<code>POST /api/auth/login</code>", style_table_cell_code),
            Paragraph("Public", style_table_cell),
            Paragraph("<code>{ email, password }</code>", style_table_cell),
            Paragraph("Validates credentials & returns signed JWT token. Returns 200 OK (401 on invalid).", style_table_cell),
        ],
        # Movies
        [
            Paragraph("<code>GET /api/movies</code>", style_table_cell_code),
            Paragraph("Public", style_table_cell),
            Paragraph("None", style_table_cell),
            Paragraph("Retrieves all movies with active show associations. Returns 200 OK.", style_table_cell),
        ],
        [
            Paragraph("<code>GET /api/movies/:id</code>", style_table_cell_code),
            Paragraph("Public", style_table_cell),
            Paragraph("None", style_table_cell),
            Paragraph("Retrieves movie details and nested upcoming showtimes. Returns 200 OK (404 if missing).", style_table_cell),
        ],
        [
            Paragraph("<code>POST /api/movies</code>", style_table_cell_code),
            Paragraph("Admin (JWT)", style_table_cell_bold),
            Paragraph("<code>{ title, genre, description, duration, rating, image }</code>", style_table_cell),
            Paragraph("Creates new movie record. Returns 201 Created.", style_table_cell),
        ],
        [
            Paragraph("<code>PUT /api/movies/:id</code>", style_table_cell_code),
            Paragraph("Admin (JWT)", style_table_cell_bold),
            Paragraph("<code>{ title, genre, duration, ... }</code>", style_table_cell),
            Paragraph("Updates existing movie attributes. Returns 200 OK.", style_table_cell),
        ],
        [
            Paragraph("<code>DELETE /api/movies/:id</code>", style_table_cell_code),
            Paragraph("Admin (JWT)", style_table_cell_bold),
            Paragraph("None", style_table_cell),
            Paragraph("Deletes movie record. Returns 200 OK.", style_table_cell),
        ],
        # Theaters
        [
            Paragraph("<code>GET /api/theaters</code>", style_table_cell_code),
            Paragraph("Public", style_table_cell),
            Paragraph("None", style_table_cell),
            Paragraph("Retrieves all theaters with total seat capacities. Returns 200 OK.", style_table_cell),
        ],
        [
            Paragraph("<code>POST /api/theaters</code>", style_table_cell_code),
            Paragraph("Admin (JWT)", style_table_cell_bold),
            Paragraph("<code>{ name, location, totalSeats }</code>", style_table_cell),
            Paragraph("Creates theater venue with configured seat capacity. Returns 201 Created.", style_table_cell),
        ],
        # Shows & Seats
        [
            Paragraph("<code>GET /api/shows</code>", style_table_cell_code),
            Paragraph("Public", style_table_cell),
            Paragraph("None", style_table_cell),
            Paragraph("Retrieves all scheduled shows with theater and movie relations. Returns 200 OK.", style_table_cell),
        ],
        [
            Paragraph("<code>POST /api/shows</code>", style_table_cell_code),
            Paragraph("Admin (JWT)", style_table_cell_bold),
            Paragraph("<code>{ movieId, theaterId, showTime, price }</code>", style_table_cell),
            Paragraph("Schedules show and automatically invokes <code>ensureSeatsForShow()</code>. Returns 201 Created.", style_table_cell),
        ],
        [
            Paragraph("<code>GET /api/seats/show/:showId</code>", style_table_cell_code),
            Paragraph("User (JWT)", style_table_cell),
            Paragraph("None", style_table_cell),
            Paragraph("Returns real-time seat status layout (available vs booked). Returns 200 OK.", style_table_cell),
        ],
        # Bookings
        [
            Paragraph("<code>POST /api/bookings</code>", style_table_cell_code),
            Paragraph("User (JWT)", style_table_cell),
            Paragraph("<code>{ showId, seatIds: [...] }</code>", style_table_cell),
            Paragraph("Atomic multi-seat booking with PostgreSQL row lock. Returns 201 (409 on conflict).", style_table_cell),
        ],
        [
            Paragraph("<code>GET /api/bookings/my</code>", style_table_cell_code),
            Paragraph("User (JWT)", style_table_cell),
            Paragraph("None", style_table_cell),
            Paragraph("Returns authenticated user's complete booking history. Returns 200 OK.", style_table_cell),
        ],
        [
            Paragraph("<code>GET /api/bookings/:id</code>", style_table_cell_code),
            Paragraph("User (JWT)", style_table_cell),
            Paragraph("None", style_table_cell),
            Paragraph("Retrieves digital e-ticket verification data for printable ticket. Returns 200 OK.", style_table_cell),
        ],
        [
            Paragraph("<code>DELETE /api/bookings/:id</code>", style_table_cell_code),
            Paragraph("User (JWT)", style_table_cell),
            Paragraph("None", style_table_cell),
            Paragraph("Cancels booking and releases seat back to 'available'. Returns 200 OK.", style_table_cell),
        ],
        # Admin Operations
        [
            Paragraph("<code>GET /api/bookings/admin/dashboard</code>", style_table_cell_code),
            Paragraph("Admin (JWT)", style_table_cell_bold),
            Paragraph("None", style_table_cell),
            Paragraph("Aggregates gross revenue (₹), total users, movies, and confirmed counts. Returns 200 OK.", style_table_cell),
        ],
    ]
    api_table = Table(api_data, colWidths=[120, 75, 140, 197])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor(PRIMARY)),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor(BG_LIGHT)]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor(BORDER_COLOR)),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(api_table)

    story.append(PageBreak())

    # =========================================================================
    # SECTION 6: TROUBLESHOOTING & COMMON FAQS
    # =========================================================================
    story.append(Paragraph("6. Troubleshooting & Common Setup FAQs", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor(BORDER_COLOR), spaceBefore=2, spaceAfter=6))

    troubleshoot_data = [
        [
            Paragraph("<b>Issue / Error Message</b>", style_table_header),
            Paragraph("<b>Root Cause</b>", style_table_header),
            Paragraph("<b>Step-by-Step Resolution</b>", style_table_header),
        ],
        [
            Paragraph("<b><code>ConnectionRefusedError: connect ECONNREFUSED 127.0.0.1:5432</code></b>", style_table_cell_bold),
            Paragraph("PostgreSQL service is not running on your machine or port 5432 is blocked.", style_table_cell),
            Paragraph("Open Windows Services (<code>services.msc</code>) and start the <b>postgresql-x64</b> service, or run <code>pg_ctl -D \"C:\\Program Files\\PostgreSQL\\16\\data\" start</code>.", style_table_cell),
        ],
        [
            Paragraph("<b><code>password authentication failed for user \"postgres\"</code></b>", style_table_cell_bold),
            Paragraph("Password in <code>backend/src/config/database.ts</code> does not match your local PostgreSQL password.", style_table_cell),
            Paragraph("Update line 6 of <code>database.ts</code> with your actual PostgreSQL superuser password and re-run <code>npm run dev</code>.", style_table_cell),
        ],
        [
            Paragraph("<b><code>EADDRINUSE: address already in use :::5050</code></b>", style_table_cell_bold),
            Paragraph("An older instance of Node/Fastify is already occupying Port 5050.", style_table_cell),
            Paragraph("Kill the stale process via PowerShell:<br/><code>Get-Process node | Stop-Process -Force</code> or find PID via <code>netstat -ano | findstr :5050</code>.", style_table_cell),
        ],
        [
            Paragraph("<b>Seat Map empty on <code>/seats/:id</code></b>", style_table_cell_bold),
            Paragraph("Show was created in a legacy database before the automated seat trigger was active.", style_table_cell),
            Paragraph("CineBook automatically triggers self-repair upon route access, or the admin can click <b>Create/Repair Seats</b> in <code>/admin/shows</code>.", style_table_cell),
        ],
    ]
    troubleshoot_table = Table(troubleshoot_data, colWidths=[140, 140, 252])
    troubleshoot_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor(PRIMARY)),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor(BG_LIGHT)]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor(BORDER_COLOR)),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(troubleshoot_table)
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECTION 7: VIVA & COORDINATOR PRESENTATION CHEAT SHEET
    # =========================================================================
    story.append(Paragraph("7. Viva & Coordinator Presentation Q&A Cheat Sheet", style_h1))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor(BORDER_COLOR), spaceBefore=2, spaceAfter=6))
    
    qa_list = [
        (
            "Q1: Why did you choose Fastify over Express.js for the backend?",
            "Fastify delivers up to 2x higher throughput than Express with minimal overhead, native async/await support, structured JSON schema validation, and low latency serialization."
        ),
        (
            "Q2: How does CineBook prevent double-booking during high-traffic ticket sales?",
            "We use PostgreSQL Row-Level Locking (<code>SELECT ... FOR UPDATE</code>) inside Sequelize transactions. The first request acquires an exclusive lock on seat rows; concurrent requests wait and receive an immediate <code>409 Conflict</code> when detecting the updated status."
        ),
        (
            "Q3: How does the dynamic seat generation mechanism work?",
            "The <code>ensureSeatsForShow()</code> service dynamically computes missing seat numbers up to the theater's capacity and bulk-creates them with <code>ignoreDuplicates: true</code>, ensuring zero missing seat layout bugs."
        ),
        (
            "Q4: How is user authentication and role authorization handled?",
            "Authentication uses stateless JSON Web Tokens (JWT) signed with user ID, email, and role. The <code>authenticate</code> middleware verifies the token, while <code>adminOnly</code> enforces <code>role === 'admin'</code>."
        ),
        (
            "Q5: What happens when a user cancels a confirmed booking?",
            "An atomic database transaction updates the booking record to <code>cancelled</code> and immediately flips the associated seat status from <code>booked</code> back to <code>available</code>, making it instantly bookable for others."
        ),
    ]

    for q, a in qa_list:
        story.append(Paragraph(f"<b><font color='{INDIGO}'>{q}</font></b>", style_body_bold))
        story.append(Paragraph(f"<b>Answer:</b> {a}", style_body))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 6))
    story.append(create_callout(
        "<b>Summary for Coordinator Demonstration:</b><br/>"
        "Start by demonstrating Admin controls (Dashboard metrics, Movies, Theaters, Shows) with <code>admin@cinebook.com</code>. "
        "Then log in as <code>user@cinebook.com</code>, filter movies, select seats on the interactive screen, confirm booking to show the printable e-ticket, "
        "and demonstrate transactional integrity by showing the seat locked, then cancelling the booking to show immediate seat recovery.",
        "5-MINUTE DEMONSTRATION SUMMARY",
        border_color=EMERALD,
        bg_color="#ECFDF5"
    ))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"SUCCESS: PDF Guide generated successfully at: {output_path}")

if __name__ == "__main__":
    target_pdf = r"d:\Training_Amadis\MovieBookingManagementSystem\CineBook_Code_Execution_And_Architecture_Guide.pdf"
    generate_guide_pdf(target_pdf)
