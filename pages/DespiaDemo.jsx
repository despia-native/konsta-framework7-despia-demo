import React, { useState, useEffect, useRef } from 'react';
import {
  Page,
  Navbar,
  Block,
  BlockTitle,
  List,
  ListItem,
  Chip,
  Tabbar,
  TabbarLink,
  ToolbarPane,
  Icon,
  Dialog,
  DialogButton,
  Sheet,
  Toolbar,
  Link,
  Button,
} from 'konsta/react';
import {
  CameraFill,
  CameraViewfinder,
  Person2Fill,
  BellFill,
  CreditcardFill,
  AppFill,
  InfoCircleFill,
  BoltFill,
  LockFill,
  ArrowUpCircleFill,
  PaperplaneFill,
  DocOnClipboardFill,
  LocationFill,
  DevicePhonePortrait,
  BubbleLeftBubbleRightFill,
  PrinterFill,
} from 'framework7-icons/react';
import despia from 'despia-native';
import CloseIcon from '../components/CloseIcon';

export default function DespiaDemo() {
  const [activeTab, setActiveTab] = useState('payments');
  const [prevTab, setPrevTab] = useState('payments');
  const [tabbarVisible, setTabbarVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastScrollY = useRef(0);
  const pageRef = useRef(null);
  
  // Dialog state
  const [dialogOpened, setDialogOpened] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [dialogData, setDialogData] = useState(null);
  
  // Sheet states
  const [hapticSheetOpened, setHapticSheetOpened] = useState(false);
  const [locationSheetOpened, setLocationSheetOpened] = useState(false);
  
  // Location tracking state
  const [locationTracking, setLocationTracking] = useState(false);
  const watchIdRef = useRef(null);

  // Helper function to show result in dialog
  const showResultDialog = (title, result, data = null) => {
    let content = '';
    if (typeof result === 'string') {
      content = result;
    } else if (typeof result === 'object') {
      content = JSON.stringify(result, null, 2);
    } else {
      content = String(result);
    }
    
    setDialogTitle(title || 'Result');
    setDialogContent(content);
    setDialogData(data || result);
    setDialogOpened(true);
  };

  // Helper to copy to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showResultDialog('Copied', 'Content copied to clipboard!');
    } catch (error) {
      showResultDialog('Error', `Failed to copy: ${error.message}`);
    }
  };

  // RevenueCat Paywall
  const launchPaywall = (offering = 'default') => {
    try {
      const userId = 'demo_user_' + Date.now();
      despia(`revenuecat://launchPaywall?external_id=${userId}&offering=${offering}`);
      showResultDialog('Paywall Launched', `Launched paywall with offering: ${offering}`);
      
      // Setup global callback for purchase confirmation
      window.onRevenueCatPurchase = () => {
        showResultDialog('Purchase Completed', 'Purchase completed! Polling backend for confirmation...');
      };
    } catch (error) {
      showResultDialog('Error', `Error: ${error.message}`);
    }
  };

  // Platform Detection
  const detectPlatform = () => {
    try {
      const userAgent = navigator.userAgent.toLowerCase();
      const isDespia = userAgent.includes('despia');
      const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad');
      const isAndroid = userAgent.includes('android');
      const result = {
        isDespia,
        isIOS,
        isAndroid,
        userAgent: navigator.userAgent
      };
      showResultDialog('Platform Detection', `Platform: Despia=${isDespia}, iOS=${isIOS}, Android=${isAndroid}`, result);
    } catch (error) {
      showResultDialog('Error', `Error: ${error.message}`);
    }
  };

  // Haptic Feedback
  const triggerHaptic = (style) => {
    try {
      despia(`${style}haptic://`);
      showResultDialog('Haptic Feedback', `Haptic feedback triggered: ${style}`);
      setHapticSheetOpened(false);
    } catch (error) {
      showResultDialog('Error', `Error: ${error.message}`);
    }
  };

  // Native Clipboard
  const readClipboard = async () => {
    try {
      const clipboardData = await despia('getclipboard://', ['clipboarddata']);
      const content = clipboardData.clipboarddata || 'Empty';
      showResultDialog('Clipboard Content', content, clipboardData);
    } catch (error) {
      showResultDialog('Error', `Error: ${error.message}`);
    }
  };

  // Social Share
  const shareContent = () => {
    try {
      const message = encodeURIComponent("Check out this amazing app!");
      const url = encodeURIComponent("https://example.com");
      despia(`shareapp://message?=${message}&url=${url}`);
      showResultDialog('Share Dialog', 'Share dialog opened');
    } catch (error) {
      showResultDialog('Error', `Error: ${error.message}`);
    }
  };

  // Save to Camera Roll
  const saveImage = () => {
    try {
      const imageUrl = "https://cdn.konstaui.com/images/placeholder-100x100-1.jpeg";
      despia(`savethisimage://?url=${imageUrl}`);
      showResultDialog('Image Save', 'Image save to camera roll initiated');
    } catch (error) {
      showResultDialog('Error', `Error: ${error.message}`);
    }
  };

  // Biometric Auth
  const authenticateBiometric = () => {
    try {
      window.onBioAuthSuccess = () => showResultDialog('Biometric Auth', 'Biometric authentication successful');
      window.onBioAuthFailure = (code, msg) => showResultDialog('Biometric Auth Failed', `Biometric authentication failed: ${code} - ${msg}`);
      window.onBioAuthUnavailable = () => showResultDialog('Biometric Auth', 'Biometric authentication unavailable');

      despia('bioauth://');
      showResultDialog('Biometric Auth', 'Biometric authentication requested');
    } catch (error) {
      showResultDialog('Error', `Error: ${error.message}`);
    }
  };

  // Background Location
  const requestLocation = async () => {
    try {
      await despia("backgroundlocationon://");
      if ("geolocation" in navigator) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const result = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date(position.timestamp).toISOString()
            };
            showResultDialog('Location Update', `Location: Lat ${position.coords.latitude}, Lon ${position.coords.longitude}`, result);
          },
          (error) => {
            showResultDialog('Location Error', `Location Error: ${error.message}`);
          },
          { enableHighAccuracy: true }
        );
        setLocationTracking(true);
        showResultDialog('Location Tracking', 'Background location tracking started');
        setLocationSheetOpened(false);
      } else {
        showResultDialog('Error', 'Geolocation not supported');
      }
    } catch (error) {
      showResultDialog('Error', `Error: ${error.message}`);
    }
  };

  const stopLocation = async () => {
    try {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      await despia("backgroundlocationoff://");
      setLocationTracking(false);
      showResultDialog('Location Tracking', 'Background location tracking stopped');
      setLocationSheetOpened(false);
    } catch (error) {
      showResultDialog('Error', `Error: ${error.message}`);
    }
  };

  // Local Push Notification
  const sendLocalPush = () => {
    try {
      const seconds = 5;
      const title = encodeURIComponent("Despia Demo");
      const message = encodeURIComponent("This is a local push notification!");
      const url = encodeURIComponent("http://localhost:5173/#/despia-demo");
      despia(`sendlocalpushmsg://push.send?s=${seconds}=msg!${message}&!#${title}&!#${url}`);
      showResultDialog('Push Notification', 'Local push notification scheduled for 5 seconds');
    } catch (error) {
      showResultDialog('Error', `Error: ${error.message}`);
    }
  };

  // File Sharing
  const shareFile = () => {
    try {
      const fileUrl = "https://www.africau.edu/images/default/sample.pdf";
      despia(fileUrl);
      showResultDialog('File Share', 'File share dialog opened');
    } catch (error) {
      showResultDialog('Error', `Error: ${error.message}`);
    }
  };

  // Screenshot Capture
  const captureScreenshot = () => {
    try {
      despia("takescreenshot://");
      showResultDialog('Screenshot', 'Screenshot capture initiated');
    } catch (error) {
      showResultDialog('Error', `Error: ${error.message}`);
    }
  };

  // Contact Access
  const accessContacts = async () => {
    try {
      despia("requestcontactpermission://");
      const contactsData = await despia('readcontacts://', ['contacts']);
      // Structure: { "Contact Name": ["+phone"] }
      const contactCount = Object.keys(contactsData.contacts || contactsData || {}).length;
      const contactsList = Object.entries(contactsData.contacts || contactsData || {})
        .map(([name, phones]) => `${name}: ${Array.isArray(phones) ? phones.join(', ') : phones}`)
        .join('\n');
      showResultDialog('Contacts', `Retrieved ${contactCount} contacts:\n\n${contactsList || 'No contacts found'}`, contactsData.contacts || contactsData);
    } catch (error) {
      showResultDialog('Error', `Error: ${error.message}`);
    }
  };

  // Device UUID
  const getDeviceUUID = async () => {
    try {
      const data = await despia('get-uuid://', ['uuid']);
      showResultDialog('Device UUID', `Device UUID: ${data.uuid}`, data);
    } catch (error) {
      showResultDialog('Error', `Error: ${error.message}`);
    }
  };

  // App Version
  const getAppVersion = async () => {
    try {
      const data = await despia('getappversion://', ['versionNumber', 'bundleNumber']);
      showResultDialog('App Version', `App Version: ${data.versionNumber}, Bundle: ${data.bundleNumber}`, data);
    } catch (error) {
      showResultDialog('Error', `Error: ${error.message}`);
    }
  };

  // Print Document
  const printDocument = (jobName = 'Document', fileUrl = 'https://doc.phomemo.com/Labels-Sample.pdf') => {
    try {
      // Only encode jobName, NOT the fileUrl per Despia documentation
      const encodedJobName = encodeURIComponent(jobName);
      // Construct URL exactly as documented: printitem://?jobName={ENCODED-NAME}&printItem={URL}
      const printUrl = `printitem://?jobName=${encodedJobName}&printItem=${fileUrl}`;
      despia(printUrl);
      showResultDialog('Print Document', `Print dialog opened for: ${jobName}\nURL: ${printUrl}`);
    } catch (error) {
      showResultDialog('Error', `Error: ${error.message}`);
    }
  };

  // Scroll behavior for Tabbar
  useEffect(() => {
    let ticking = false;
    let scrollContainer = null;
    
    const handleScroll = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          let currentScrollY = 0;
          
          if (e && e.target && e.target !== document && e.target !== window) {
            currentScrollY = e.target.scrollTop || 0;
          } else {
            currentScrollY = window.scrollY || 
                           document.documentElement.scrollTop || 
                           (document.scrollingElement && document.scrollingElement.scrollTop) || 0;
          }
          
          if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
            setTabbarVisible(false);
          } else if (currentScrollY < lastScrollY.current || currentScrollY <= 50) {
            setTabbarVisible(true);
          }
          
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    const setupListeners = () => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      if (pageRef.current) {
        const pageElement = pageRef.current;
        const allElements = pageElement.querySelectorAll('*');
        for (const el of allElements) {
          if (el.scrollHeight > el.clientHeight && 
              (el.style.overflow === 'auto' || el.style.overflow === 'scroll' || 
               getComputedStyle(el).overflow === 'auto' || getComputedStyle(el).overflow === 'scroll')) {
            el.addEventListener('scroll', handleScroll, { passive: true });
            scrollContainer = el;
            break;
          }
        }
      }
      
      if (document.body && document.body.scrollHeight > document.body.clientHeight) {
        document.body.addEventListener('scroll', handleScroll, { passive: true });
      }
      if (document.documentElement && document.documentElement.scrollHeight > document.documentElement.clientHeight) {
        document.documentElement.addEventListener('scroll', handleScroll, { passive: true });
      }
    };

    const timeoutId = setTimeout(setupListeners, 200);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      document.body?.removeEventListener('scroll', handleScroll);
      document.documentElement?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle tab change with transition
  const handleTabChange = (newTab) => {
    if (newTab === activeTab || isTransitioning) return;
    
    setIsTransitioning(true);
    setPrevTab(activeTab);
    
    // Start transition - change tab immediately but show both during transition
    setTimeout(() => {
      setActiveTab(newTab);
      
      // End transition after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
        setPrevTab(newTab);
      }, 300);
    }, 50);
  };

  // Render content based on tab
  const renderTabContent = (tab) => {
    switch (tab) {
      case 'payments':
        return (
          <>
            <BlockTitle>RevenueCat Paywalls</BlockTitle>
            <List strong inset>
              <ListItem
                link
                onClick={() => launchPaywall('default')}
                media={<CreditcardFill className="w-7 h-7" />}
                title="Launch Default Paywall"
                after="Launch"
              />
              <ListItem
                link
                onClick={() => launchPaywall('premium')}
                media={<CreditcardFill className="w-7 h-7" />}
                title="Launch Premium Paywall"
                after="Launch"
              />
              <ListItem
                link
                onClick={() => launchPaywall('annual_sale')}
                media={<CreditcardFill className="w-7 h-7" />}
                title="Launch Sale Paywall"
                after="Launch"
              />
            </List>
          </>
        );

      case 'device':
        return (
          <>
            <BlockTitle>Platform & Device</BlockTitle>
            <List strong inset>
              <ListItem
                link
                onClick={detectPlatform}
                media={<AppFill className="w-7 h-7" />}
                title="Platform Detection"
                after="Detect"
              />
              <ListItem
                link
                onClick={getDeviceUUID}
                media={<AppFill className="w-7 h-7" />}
                title="Device UUID"
                after="Get"
              />
              <ListItem
                link
                onClick={getAppVersion}
                media={<InfoCircleFill className="w-7 h-7" />}
                title="App Version Info"
                after="Get"
              />
              <ListItem
                link
                onClick={() => setHapticSheetOpened(true)}
                media={<BoltFill className="w-7 h-7" />}
                title="Haptic Feedback"
                subtitle="Tap to select type"
                after="Select"
              />
            </List>
          </>
        );

      case 'communication':
        return (
          <>
            <BlockTitle>Authentication & Security</BlockTitle>
            <List strong inset>
              <ListItem
                link
                onClick={authenticateBiometric}
                media={<LockFill className="w-7 h-7" />}
                title="Biometric Verification"
                subtitle="Face ID / Touch ID / Fingerprint"
                after="Authenticate"
              />
            </List>

            <BlockTitle>Sharing & Communication</BlockTitle>
            <List strong inset>
              <ListItem
                link
                onClick={shareContent}
                media={<ArrowUpCircleFill className="w-7 h-7" />}
                title="Social Share Dialog"
                after="Share"
              />
              <ListItem
                link
                onClick={shareFile}
                media={<PaperplaneFill className="w-7 h-7" />}
                title="File Sharing"
                after="Share"
              />
              <ListItem
                link
                onClick={readClipboard}
                media={<DocOnClipboardFill className="w-7 h-7" />}
                title="Native Clipboard (Read Only)"
                after="Read"
              />
              <ListItem
                link
                onClick={accessContacts}
                media={<Person2Fill className="w-7 h-7" />}
                title="Contact Access"
                after="Access"
              />
            </List>
          </>
        );

      case 'media':
        return (
          <>
            <BlockTitle>Media & Storage</BlockTitle>
            <List strong inset>
              <ListItem
                link
                onClick={saveImage}
                media={<CameraFill className="w-7 h-7" />}
                title="Save to Camera Roll"
                after="Save"
              />
              <ListItem
                link
                onClick={captureScreenshot}
                media={<CameraViewfinder className="w-7 h-7" />}
                title="Screenshot Capture"
                after="Capture"
              />
              <ListItem
                link
                onClick={() => printDocument('Print Ticket', 'https://www.despia.com/images/logo.png')}
                media={<PrinterFill className="w-7 h-7" />}
                title="Print Document"
                subtitle="Print PDF or image"
                after="Print"
              />
            </List>

            <BlockTitle>Notifications & Location</BlockTitle>
            <List strong inset>
              <ListItem
                link
                onClick={sendLocalPush}
                media={<BellFill className="w-7 h-7" />}
                title="Local Push Notification"
                subtitle="Scheduled for 5 seconds"
                after="Send"
              />
              <ListItem
                link
                onClick={() => setLocationSheetOpened(true)}
                media={<LocationFill className="w-7 h-7" />}
                title="Background Location"
                subtitle={locationTracking ? 'Tracking Active' : 'Tap to control'}
                after="Control"
              />
            </List>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Page ref={pageRef}>
      <Navbar 
        title="Despia Native SDK" 
        subtitle="Demo Application"
        large 
        transparent
        centerTitle
        style={{ paddingTop: 'var(--safe-area-top, 0px)' }}
      />

      <div className="relative" style={{ minHeight: '100%' }}>
        {/* Previous tab content - exiting */}
        {isTransitioning && prevTab !== activeTab && (
          <div className="page-transition-fade-exit absolute inset-0 w-full">
            {renderTabContent(prevTab)}
          </div>
        )}
        
        {/* Current tab content - entering */}
        <div className={isTransitioning && prevTab !== activeTab ? 'page-transition-fade-enter' : ''}>
          {renderTabContent(activeTab)}
        </div>
      </div>

      {/* Bottom padding for tabbar + safe area */}
      <div style={{ height: 'calc(64px + var(--safe-area-bottom, 0px))', minHeight: '80px' }} />

      {/* Result Dialog */}
      <Dialog
        opened={dialogOpened}
        onBackdropClick={() => setDialogOpened(false)}
        title={dialogTitle}
        content={
          <div className="space-y-2">
            <pre className="text-xs font-mono whitespace-pre-wrap break-words bg-gray-100 dark:bg-gray-800 p-2 rounded">
              {dialogContent}
            </pre>
            {dialogData && typeof dialogData === 'object' && (
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {Object.keys(dialogData).length} properties
              </div>
            )}
          </div>
        }
        buttons={
          <>
            {dialogData && (
              <DialogButton onClick={() => copyToClipboard(typeof dialogData === 'object' ? JSON.stringify(dialogData, null, 2) : dialogContent)}>
                Copy
              </DialogButton>
            )}
            <DialogButton strong onClick={() => setDialogOpened(false)}>
              Close
            </DialogButton>
          </>
        }
      />

      {/* Haptic Feedback Sheet */}
      <Sheet
        className="pb-safe"
        opened={hapticSheetOpened}
        onBackdropClick={() => setHapticSheetOpened(false)}
      >
        <Toolbar top className="justify-end ios:pt-4">
          <div className="ios:hidden" />
          <ToolbarPane>
            <Link iconOnly onClick={() => setHapticSheetOpened(false)}>
              <CloseIcon />
            </Link>
          </ToolbarPane>
        </Toolbar>
        <Block className="ios:mt-4">
          <BlockTitle>Select Haptic Feedback</BlockTitle>
          <List strong inset>
            <ListItem
              link
              onClick={() => triggerHaptic('light')}
              media={<BoltFill className="w-7 h-7" />}
              title="Light"
            />
            <ListItem
              link
              onClick={() => triggerHaptic('medium')}
              media={<BoltFill className="w-7 h-7" />}
              title="Medium"
            />
            <ListItem
              link
              onClick={() => triggerHaptic('heavy')}
              media={<BoltFill className="w-7 h-7" />}
              title="Heavy"
            />
            <ListItem
              link
              onClick={() => triggerHaptic('success')}
              media={<BoltFill className="w-7 h-7" />}
              title="Success"
            />
            <ListItem
              link
              onClick={() => triggerHaptic('warning')}
              media={<BoltFill className="w-7 h-7" />}
              title="Warning"
            />
            <ListItem
              link
              onClick={() => triggerHaptic('error')}
              media={<BoltFill className="w-7 h-7" />}
              title="Error"
            />
          </List>
        </Block>
      </Sheet>

      {/* Location Control Sheet */}
      <Sheet
        className="pb-safe"
        opened={locationSheetOpened}
        onBackdropClick={() => setLocationSheetOpened(false)}
      >
        <Toolbar top className="justify-end ios:pt-4">
          <div className="ios:hidden" />
          <ToolbarPane>
            <Link iconOnly onClick={() => setLocationSheetOpened(false)}>
              <CloseIcon />
            </Link>
          </ToolbarPane>
        </Toolbar>
        <Block className="ios:mt-4">
          <BlockTitle>Location Tracking</BlockTitle>
          <List strong inset>
            <ListItem
              link
              onClick={requestLocation}
              media={<LocationFill className="w-7 h-7" />}
              title="Start Location Tracking"
              subtitle={locationTracking ? 'Currently active' : 'Begin background tracking'}
              after="Start"
            />
            <ListItem
              link
              onClick={stopLocation}
              media={<LocationFill className="w-7 h-7" />}
              title="Stop Location Tracking"
              subtitle={locationTracking ? 'Stop current tracking' : 'Not currently tracking'}
              after="Stop"
            />
          </List>
        </Block>
      </Sheet>

      {/* Tabbar */}
      <Tabbar
        labels={true}
        icons={true}
        className={`left-0 bottom-0 fixed transition-transform duration-300 ${
          tabbarVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'var(--safe-area-bottom, 0px)' }}
      >
        <ToolbarPane>
          <TabbarLink
            active={activeTab === 'payments'}
            onClick={() => handleTabChange('payments')}
            icon={
              <Icon
                ios={<CreditcardFill className="w-7 h-7" />}
                material={<CreditcardFill className="w-6 h-6" />}
              />
            }
            label="Pay"
          />
          <TabbarLink
            active={activeTab === 'device'}
            onClick={() => handleTabChange('device')}
            icon={
              <Icon
                ios={<DevicePhonePortrait className="w-7 h-7" />}
                material={<DevicePhonePortrait className="w-6 h-6" />}
              />
            }
            label="Device"
          />
          <TabbarLink
            active={activeTab === 'communication'}
            onClick={() => handleTabChange('communication')}
            icon={
              <Icon
                ios={<BubbleLeftBubbleRightFill className="w-7 h-7" />}
                material={<BubbleLeftBubbleRightFill className="w-6 h-6" />}
              />
            }
            label="Share"
          />
          <TabbarLink
            active={activeTab === 'media'}
            onClick={() => handleTabChange('media')}
            icon={
              <Icon
                ios={<LocationFill className="w-7 h-7" />}
                material={<LocationFill className="w-6 h-6" />}
              />
            }
            label="Media"
          />
        </ToolbarPane>
      </Tabbar>
    </Page>
  );
}
