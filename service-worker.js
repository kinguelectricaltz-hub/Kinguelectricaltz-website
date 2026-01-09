{
  "name": "Kingu Electrical Company Ltd",
  "short_name": "Kingu Electrical",
  "description": "Tanzania's Leading Electrical Engineering Experts - Generator Installation, PLC Programming, Solar Systems & Industrial Automation",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#1a5632",
  "background_color": "#1a5632",
  "categories": ["business", "engineering", "shopping", "utilities"],
  "dir": "ltr",
  "lang": "en-TZ",
  "id": "/",
  
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-180x180.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "apple touch icon"
    },
    {
      "src": "/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icon-48x48.png",
      "sizes": "48x48",
      "type": "image/png"
    }
  ],
  
  "screenshots": [
    {
      "src": "/screenshot-mobile.png",
      "sizes": "375x667",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Kingu Electrical Mobile App Home Screen"
    },
    {
      "src": "/screenshot-tablet.png",
      "sizes": "768x1024",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Kingu Electrical Tablet View - Products Catalog"
    },
    {
      "src": "/screenshot-desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Kingu Electrical Desktop - Complete Services Overview"
    }
  ],
  
  "shortcuts": [
    {
      "name": "⚡ Order Generator",
      "short_name": "Generators",
      "description": "Browse & Order Diesel Generators",
      "url": "/#generators",
      "icons": [
        {
          "src": "/shortcut-generator.png",
          "sizes": "96x96",
          "type": "image/png"
        }
      ]
    },
    {
      "name": "🔧 Emergency Service",
      "short_name": "Emergency 24/7",
      "description": "24/7 Emergency Electrical Repair",
      "url": "/#emergency",
      "icons": [
        {
          "src": "/shortcut-emergency.png",
          "sizes": "96x96",
          "type": "image/png"
        }
      ]
    },
    {
      "name": "📞 Quick Contact",
      "short_name": "Contact Us",
      "description": "Call or WhatsApp for Immediate Support",
      "url": "/#contact",
      "icons": [
        {
          "src": "/shortcut-contact.png",
          "sizes": "96x96",
          "type": "image/png"
        }
      ]
    },
    {
      "name": "🛒 Electrical Shop",
      "short_name": "Shop Online",
      "description": "Browse Electrical Products & Spares",
      "url": "/#products",
      "icons": [
        {
          "src": "/shortcut-shop.png",
          "sizes": "96x96",
          "type": "image/png"
        }
      ]
    }
  ],
  
  "related_applications": [],
  "prefer_related_applications": false,
  
  "launch_handler": {
    "client_mode": "focus-existing"
  },
  
  "handle_links": "preferred",
  
  "edge_side_panel": {
    "preferred_width": 400
  },
  
  "protocol_handlers": [
    {
      "protocol": "web+kingu",
      "url": "/?protocol=%s"
    },
    {
      "protocol": "mailto",
      "url": "/#contact?email=%s"
    }
  ],
  
  "share_target": {
    "action": "/share",
    "method": "GET",
    "enctype": "application/x-www-form-urlencoded",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  },
  
  "display_override": ["window-controls-overlay", "standalone", "minimal-ui"],
  
  "capture_links": "new-client",
  
  "file_handlers": [
    {
      "action": "/upload",
      "accept": {
        "application/pdf": [".pdf"],
        "image/*": [".png", ".jpg", ".jpeg"]
      }
    }
  ],
  
  "permissions": [
    "clipboard-write",
    "clipboard-read",
    "geolocation"
  ],
  
  "shortcuts_icons": {
    "48": "/shortcut-icon-48.png",
    "72": "/shortcut-icon-72.png",
    "96": "/shortcut-icon-96.png",
    "144": "/shortcut-icon-144.png",
    "192": "/shortcut-icon-192.png"
  },
  
  "iarc_rating_id": "e3b7d4a5-6f8c-4c5b-9e2a-1d3c4e5f6a7b",
  
  "prefer_related_applications": false,
  
  "related_applications": [
    {
      "platform": "play",
      "url": "https://play.google.com/store/apps/details?id=com.kinguelectrical.tz",
      "id": "com.kinguelectrical.tz"
    },
    {
      "platform": "itunes",
      "url": "https://apps.apple.com/us/app/kingu-electrical/id1234567890"
    }
  ]
}
