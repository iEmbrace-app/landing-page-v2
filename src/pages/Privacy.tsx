import { useEffect } from 'react'
import './privacy.css'

/**
 * Privacy page renders the privacy policy content.
 * Converted from Termly-generated HTML to clean TSX.
 */
export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy - iEmbrace LLC';
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Handle in-page anchor navigation
  useEffect(() => {
    const root = document.getElementById('privacy-root');
    if (!root) return;

    const scrollToId = (id: string) => {
      const byId = root.querySelector(`#${CSS.escape(id)}`) as HTMLElement | null;
      const byName = root.querySelector(`[name="${CSS.escape(id)}"]`) as HTMLElement | null;
      const target = byId || byName;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
      }
      return false;
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a') as HTMLAnchorElement | null;
      if (!anchor || !root.contains(anchor)) return;
      
      const rawHref = anchor.getAttribute('href') || '';
      if (rawHref.startsWith('#') && !rawHref.startsWith('#/')) {
        e.preventDefault();
        const id = rawHref.slice(1);
        const newUrl = `#/privacy?section=${encodeURIComponent(id)}`;
        history.replaceState(null, '', newUrl);
        if (!scrollToId(id)) {
          setTimeout(() => scrollToId(id), 0);
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  // Handle section query parameter
  useEffect(() => {
    const hash = window.location.hash;
    const query = hash.split('?')[1] || '';
    const params = new URLSearchParams(query);
    const section = params.get('section');
    if (section) {
      setTimeout(() => {
        const root = document.getElementById('privacy-root');
        const el = root?.querySelector(`#${CSS.escape(section)}`) as HTMLElement | null;
        if (el) {
          el.scrollIntoView({ behavior: 'auto', block: 'start' });
        } else {
          const byName = root?.querySelector(`[name="${CSS.escape(section)}"]`) as HTMLElement | null;
          byName?.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }, 0);
    }
  }, []);

  return (
    <div id="privacy-root">
      <div className="privacy-card">
        <div className="privacy-topbar">
          <a className="back-link" href="#/" aria-label="Back to Home">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Back to Home</span>
          </a>
        </div>
        <div className="privacy-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="178" height="38" viewBox="0 0 178 38">
            <g fill="none" fillRule="evenodd">
              <path fill="#D1D1D1" d="M4.283 24.107c-.705 0-1.258-.256-1.66-.768h-.085c.057.502.086.792.086.87v2.434H.985v-8.648h1.332l.231.779h.076c.383-.594.95-.892 1.702-.892.71 0 1.264.274 1.665.822.401.548.602 1.309.602 2.283 0 .64-.094 1.198-.282 1.67-.188.473-.456.833-.803 1.08-.347.247-.756.37-1.225.37zM3.8 19.193c-.405 0-.7.124-.886.373-.187.249-.283.66-.29 1.233v.177c0 .645.095 1.107.287 1.386.192.28.495.419.91.419.734 0 1.101-.605 1.101-1.816 0-.59-.09-1.034-.27-1.329-.182-.295-.465-.443-.852-.443zm5.57 1.794c0 .594.098 1.044.293 1.348.196.304.513.457.954.457.437 0 .75-.152.942-.454.192-.303.288-.753.288-1.351 0-.595-.097-1.04-.29-1.338-.194-.297-.51-.445-.95-.445-.438 0-.753.147-.946.443-.194.295-.29.742-.29 1.34zm4.153 0c0 .977-.258 1.742-.774 2.293-.515.552-1.233.827-2.154.827-.576 0-1.085-.126-1.525-.378a2.52 2.52 0 0 1-1.015-1.088c-.237-.473-.355-1.024-.355-1.654 0-.981.256-1.744.768-2.288.512-.545 1.232-.817 2.16-.817.576 0 1.085.126 1.525.376.44.251.779.61 1.015 1.08.236.469.355 1.019.355 1.649zM19.71 24l-.462-2.1-.623-2.653h-.037L17.493 24H15.73l-1.708-6.005h1.633l.693 2.659c.11.476.224 1.133.338 1.971h.032c.015-.272.077-.704.188-1.294l.086-.457.742-2.879h1.804l.704 2.879c.014.079.037.195.067.35a20.998 20.998 0 0 1 .167 1.002c.023.165.036.299.04.399h.032c.032-.258.09-.611.172-1.06.082-.45.141-.754.177-.911l.72-2.659h1.606L21.494 24h-1.783zm7.086-4.952c-.348 0-.62.11-.817.33-.197.22-.31.533-.338.937h2.299c-.008-.404-.113-.717-.317-.937-.204-.22-.48-.33-.827-.33zm.23 5.06c-.966 0-1.722-.267-2.266-.8-.544-.534-.816-1.29-.816-2.267 0-1.007.251-1.785.754-2.334.503-.55 1.199-.825 2.087-.825.848 0 1.51.242 1.982.725.472.484.709 1.152.709 2.004v.795h-3.873c.018.465.156.829.414 1.09.258.261.62.392 1.085.392.361 0 .703-.037 1.026-.113a5.133 5.133 0 0 0 1.01-.36v1.268c-.287.143-.593.25-.92.32a5.79 5.79 0 0 1-1.191.104zm7.253-6.226c.222 0 .406.016.553.049l-.124 1.536a1.877 1.877 0 0 0-.483-.054c-.523 0-.93.134-1.222.403-.292.268-.438.644-.438 1.128V24h-1.638v-6.005h1.24l.242 1.01h.08c.187-.337.439-.608.756-.814a1.86 1.86 0 0 1 1.034-.309zm4.029 1.166c-.347 0-.62.11-.817.33-.197.22-.31.533-.338.937h2.299c-.007-.404-.113-.717-.317-.937-.204-.22-.48-.33-.827-.33zm.23 5.06c-.966 0-1.722-.267-2.266-.8-.544-.534-.816-1.29-.816-2.267 0-1.007.251-1.785.754-2.334.504-.55 1.2-.825 2.087-.825.849 0 1.51.242 1.982.725.473.484.709 1.152.709 2.004v.795h-3.873c.018.465.156.829.414 1.09.258.261.62.392 1.085.392.362 0 .704-.037 1.026-.113a5.133 5.133 0 0 0 1.01-.36v1.268c-.287.143-.593.25-.919.32a5.79 5.79 0 0 1-1.192.104zm5.803 0c-.706 0-1.26-.275-1.663-.822-.403-.548-.604-1.307-.604-2.278 0-.984.205-1.752.615-2.301.41-.55.975-.825 1.695-.825.755 0 1.332.294 1.729.881h.054a6.697 6.697 0 0 1-.124-1.198v-1.922h1.644V24H46.43l-.317-.779h-.07c-.372.591-.94.886-1.702.886zm.574-1.306c.42 0 .726-.121.921-.365.196-.243.302-.657.32-1.24v-.178c0-.644-.1-1.106-.298-1.386-.199-.279-.522-.419-.97-.419a.962.962 0 0 0-.85.465c-.203.31-.304.76-.304 1.35 0 .592.102 1.035.306 1.33.204.296.496.443.875.443zm10.922-4.92c.709 0 1.264.277 1.665.83.4.553.601 1.312.601 2.275 0 .992-.206 1.76-.62 2.304-.414.544-.977.816-1.69.816-.705 0-1.258-.256-1.659-.768h-.113l-.274.661h-1.251v-8.357h1.638v1.944c0 .247-.021.643-.064 1.187h.064c.383-.594.95-.892 1.703-.892zm-.527 1.31c-.404 0-.7.125-.886.374-.186.249-.283.66-.29 1.233v.177c0 .645.096 1.107.287 1.386.192.28.495.419.91.419.337 0 .605-.155.804-.465.199-.31.298-.76.298-1.35 0-.591-.1-1.035-.3-1.33a.943.943 0 0 0-.823-.443zm3.186-1.197h1.794l1.134 3.379c.096.293.163.64.198 1.042h.033c.039-.37.116-.717.23-1.042l1.112-3.379h1.757l-2.54 6.773c-.234.627-.566 1.096-.997 1.407-.432.312-.936.468-1.512.468-.283 0-.56-.03-.833-.092v-1.3a2.8 2.8 0 0 0 .645.07c.29 0 .543-.088.76-.266.217-.177.386-.444.508-.803l.096-.295-2.385-5.962z"/>
              <g transform="translate(73)">
                <circle cx="19" cy="19" r="19" fill="#E0E0E0"/>
                <path fill="#FFF" d="M22.474 15.443h5.162L12.436 30.4V10.363h15.2l-5.162 5.08z"/>
              </g>
              <path fill="#D2D2D2" d="M121.544 14.56v-1.728h8.272v1.728h-3.024V24h-2.24v-9.44h-3.008zm13.744 9.568c-1.29 0-2.341-.419-3.152-1.256-.81-.837-1.216-1.944-1.216-3.32s.408-2.477 1.224-3.304c.816-.827 1.872-1.24 3.168-1.24s2.36.403 3.192 1.208c.832.805 1.248 1.88 1.248 3.224 0 .31-.021.597-.064.864h-6.464c.053.576.267 1.04.64 1.392.373.352.848.528 1.424.528.779 0 1.355-.32 1.728-.96h2.432a3.891 3.891 0 0 1-1.488 2.064c-.736.533-1.627.8-2.672.8zm1.48-6.688c-.4-.352-.883-.528-1.448-.528s-1.037.176-1.416.528c-.379.352-.605.821-.68 1.408h4.192c-.032-.587-.248-1.056-.648-1.408zm7.016-2.304v1.568c.597-1.13 1.461-1.696 2.592-1.696v2.304h-.56c-.672 0-1.179.168-1.52.504-.341.336-.512.915-.512 1.736V24h-2.256v-8.864h2.256zm6.448 0v1.328c.565-.97 1.483-1.456 2.752-1.456.672 0 1.272.155 1.8.464.528.31.936.752 1.224 1.328.31-.555.733-.992 1.272-1.312a3.488 3.488 0 0 1 1.816-.48c1.056 0 1.907.33 2.552.992.645.661.968 1.59.968 2.784V24h-2.24v-4.896c0-.693-.176-1.224-.528-1.592-.352-.368-.832-.552-1.44-.552s-1.09.184-1.448.552c-.357.368-.536.899-.536 1.592V24h-2.24v-4.896c0-.693-.176-1.224-.528-1.592-.352-.368-.832-.552-1.44-.552s-1.09.184-1.448.552c-.357.368-.536.899-.536 1.592V24h-2.256v-8.864h2.256zM164.936 24V12.16h2.256V24h-2.256zm7.04-.16l-3.472-8.704h2.528l2.256 6.304 2.384-6.304h2.352l-5.536 13.056h-2.352l1.84-4.352z"/>
            </g>
          </svg>
        </div>

        <div className="privacy-body">
          <div className="privacy-header">
            <h1 className="privacy-title">PRIVACY POLICY</h1>
            <p className="privacy-subtitle">Last updated August 22, 2025</p>
          </div>

          <div className="privacy-intro">
            <p className="body-text">
              This Privacy Notice for <strong>iEmbrace LLC</strong> ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
            </p>
            <ul>
              <li className="body-text">Download and use our mobile application (Embraceland), or any other application of ours that links to this Privacy Notice</li>
              <li className="body-text">Use A mobile app that you can use to relax, calm down, and share your personal thoughts</li>
              <li className="body-text">Engage with us in other related ways, including any sales, marketing, or events</li>
            </ul>
            <p className="body-text">
              <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at simon@iembraceland.com.
            </p>
          </div>

          <div className="privacy-summary">
            <h2 className="heading-1">SUMMARY OF KEY POINTS</h2>
            <p className="body-text">
              <strong><em>This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our </em></strong>
              <a className="privacy-link" href="#toc"><strong><em>table of contents</em></strong></a>
              <strong><em> below to find the section you are looking for.</em></strong>
            </p>

            <div className="summary-points">
              <p className="body-text">
                <strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use. Learn more about <a className="privacy-link" href="#personalinfo">personal information you disclose to us</a>.
              </p>
              <p className="body-text">
                <strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.
              </p>
              <p className="body-text">
                <strong>Do we collect any information from third parties?</strong> We do not collect any information from third parties.
              </p>
              <p className="body-text">
                <strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Learn more about <a className="privacy-link" href="#infouse">how we process your information</a>.
              </p>
              <p className="body-text">
                <strong>In what situations and with which parties do we share personal information?</strong> We may share information in specific situations and with specific third parties. Learn more about <a className="privacy-link" href="#whoshare">when and with whom we share your personal information</a>.
              </p>
              <p className="body-text">
                <strong>What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Learn more about <a className="privacy-link" href="#privacyrights">your privacy rights</a>.
              </p>
              <p className="body-text">
                <strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is by submitting a <a className="privacy-link" href="https://app.termly.io/notify/4b9acf44-d8df-437b-b560-c3111b540ab7" target="_blank" rel="noopener noreferrer">data subject access request</a>, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.
              </p>
              <p className="body-text">
                Want to learn more about what we do with any information we collect? <a className="privacy-link" href="#toc">Review the Privacy Notice in full</a>.
              </p>
            </div>
          </div>

          <div id="toc" className="privacy-toc">
            <h2 className="heading-1">TABLE OF CONTENTS</h2>
            <ol className="toc-list">
              <li><a className="privacy-link" href="#infocollect">1. WHAT INFORMATION DO WE COLLECT?</a></li>
              <li><a className="privacy-link" href="#infouse">2. HOW DO WE PROCESS YOUR INFORMATION?</a></li>
              <li><a className="privacy-link" href="#whoshare">3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></li>
              <li><a className="privacy-link" href="#ai">4. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</a></li>
              <li><a className="privacy-link" href="#sociallogins">5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a></li>
              <li><a className="privacy-link" href="#inforetain">6. HOW LONG DO WE KEEP YOUR INFORMATION?</a></li>
              <li><a className="privacy-link" href="#infominors">7. DO WE COLLECT INFORMATION FROM MINORS?</a></li>
              <li><a className="privacy-link" href="#privacyrights">8. WHAT ARE YOUR PRIVACY RIGHTS?</a></li>
              <li><a className="privacy-link" href="#DNT">9. CONTROLS FOR DO-NOT-TRACK FEATURES</a></li>
              <li><a className="privacy-link" href="#uslaws">10. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</a></li>
              <li><a className="privacy-link" href="#policyupdates">11. DO WE MAKE UPDATES TO THIS NOTICE?</a></li>
              <li><a className="privacy-link" href="#contact">12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a></li>
              <li><a className="privacy-link" href="#request">13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</a></li>
            </ol>
          </div>

          <section id="infocollect" className="privacy-section">
            <h2 className="heading-1">1. WHAT INFORMATION DO WE COLLECT?</h2>
            
            <h3 id="personalinfo" className="heading-2">Personal information you disclose to us</h3>
            <p className="body-text">
              <strong><em>In Short:</em></strong> <em>We collect personal information that you provide to us.</em>
            </p>
            <p className="body-text">
              We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
            </p>
            <p className="body-text">
              <strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
            </p>
            <ul>
              <li className="body-text">names</li>
              <li className="body-text">email addresses</li>
              <li className="body-text">job titles</li>
              <li className="body-text">usernames</li>
              <li className="body-text">passwords</li>
            </ul>
            <p className="body-text">
              <strong>Sensitive Information.</strong> We do not process sensitive information.
            </p>
            <p className="body-text">
              <strong>Social Media Login Data.</strong> We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account. If you choose to register in this way, we will collect certain profile information about you from the social media provider, as described in the section called <a className="privacy-link" href="#sociallogins">HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a> below.
            </p>
            <p className="body-text">
              <strong>Application Data.</strong> If you use our application(s), we also may collect the following information if you choose to provide us with access or permission:
            </p>
            <ul>
              <li className="body-text"><em>Mobile Device Access.</em> We may request access or permission to certain features from your mobile device, including your mobile device's calendar, social media accounts, storage, and other features. If you wish to change our access or permissions, you may do so in your device's settings.</li>
            </ul>
            <p className="body-text">
              This information is primarily needed to maintain the security and operation of our application(s), for troubleshooting, and for our internal analytics and reporting purposes.
            </p>
            <p className="body-text">
              All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.
            </p>
            
            <h3 className="heading-2">Google API</h3>
            <p className="body-text">
              Our use of information received from Google APIs will adhere to <a className="privacy-link" href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the <a className="privacy-link" href="https://developers.google.com/terms/api-services-user-data-policy#limited-use" target="_blank" rel="noopener noreferrer">Limited Use requirements</a>.
            </p>
          </section>

          <section id="infouse" className="privacy-section">
            <h2 className="heading-1">2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
            <p className="body-text">
              <strong><em>In Short:</em></strong> <em>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</em>
            </p>
            <p className="body-text">
              <strong>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</strong>
            </p>
            <ul>
              <li className="body-text"><strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong> We may process your information so you can create and log in to your account, as well as keep your account in working order.</li>
              <li className="body-text"><strong>To deliver and facilitate delivery of services to the user.</strong> We may process your information to provide you with the requested service.</li>
              <li className="body-text"><strong>To request feedback.</strong> We may process your information when necessary to request feedback and to contact you about your use of our Services.</li>
              <li className="body-text"><strong>To identify usage trends.</strong> We may process information about how you use our Services to better understand how they are being used so we can improve them.</li>
            </ul>
          </section>

          <section id="whoshare" className="privacy-section">
            <h2 className="heading-1">3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
            <p className="body-text">
              <strong><em>In Short:</em></strong> <em>We may share information in specific situations described in this section and/or with the following third parties.</em>
            </p>
            <p className="body-text">
              We may need to share your personal information in the following situations:
            </p>
            <ul>
              <li className="body-text"><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            </ul>
          </section>

          <section id="ai" className="privacy-section">
            <h2 className="heading-1">4. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</h2>
            <p className="body-text">
              <strong><em>In Short:</em></strong> <em>We offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies.</em>
            </p>
            <p className="body-text">
              As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies (collectively, "AI Products"). These tools are designed to enhance your experience and provide you with innovative solutions. The terms in this Privacy Notice govern your use of the AI Products within our Services.
            </p>
            
            <h3 className="heading-2">Use of AI Technologies</h3>
            <p className="body-text">
              We provide the AI Products through third-party service providers ("AI Service Providers"), including Amazon Bedrock. As outlined in this Privacy Notice, your input, output, and personal information will be shared with and processed by these AI Service Providers to enable your use of our AI Products for purposes outlined in <a className="privacy-link" href="#whoshare">WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a> You must not use the AI Products in any way that violates the terms or policies of any AI Service Provider.
            </p>
            
            <h3 className="heading-2">Our AI Products</h3>
            <p className="body-text">
              Our AI Products are designed for the following functions:
            </p>
            <ul>
              <li className="body-text">AI applications</li>
            </ul>
            
            <h3 className="heading-2">How We Process Your Data Using AI</h3>
            <p className="body-text">
              All personal information processed using our AI Products is handled in line with our Privacy Notice and our agreement with third parties. This ensures high security and safeguards your personal information throughout the process, giving you peace of mind about your data's safety.
            </p>
          </section>

          <section id="sociallogins" className="privacy-section">
            <h2 className="heading-1">5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</h2>
            <p className="body-text">
              <strong><em>In Short:</em></strong> <em>If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.</em>
            </p>
            <p className="body-text">
              Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or X logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.
            </p>
            <p className="body-text">
              We will use the information we receive only for the purposes that are described in this Privacy Notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.
            </p>
          </section>

          <section id="inforetain" className="privacy-section">
            <h2 className="heading-1">6. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
            <p className="body-text">
              <strong><em>In Short:</em></strong> <em>We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.</em>
            </p>
            <p className="body-text">
              We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.
            </p>
            <p className="body-text">
              When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
            </p>
          </section>

          <section id="infominors" className="privacy-section">
            <h2 className="heading-1">7. DO WE COLLECT INFORMATION FROM MINORS?</h2>
            <p className="body-text">
              <strong><em>In Short:</em></strong> <em>We do not knowingly collect data from or market to children under 18 years of age.</em>
            </p>
            <p className="body-text">
              We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at simon@iembraceland.com.
            </p>
          </section>

          <section id="privacyrights" className="privacy-section">
            <h2 className="heading-1">8. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
            <p className="body-text">
              <strong><em>In Short:</em></strong> <em>You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.</em>
            </p>
            
            <h3 className="heading-2">Withdrawing your consent:</h3>
            <p className="body-text">
              If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section <a className="privacy-link" href="#contact">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a> below.
            </p>
            <p className="body-text">
              However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.
            </p>
            
            <h3 className="heading-2">Account Information</h3>
            <p className="body-text">
              If you would at any time like to review or change the information in your account or terminate your account, you can:
            </p>
            <ul>
              <li className="body-text">Contact us using the contact information provided.</li>
              <li className="body-text">Log in to your account settings and update your user account.</li>
            </ul>
            <p className="body-text">
              Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.
            </p>
            <p className="body-text">
              If you have questions or comments about your privacy rights, you may email us at simon@iembraceland.com.
            </p>
          </section>

          <section id="DNT" className="privacy-section">
            <h2 className="heading-1">9. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
            <p className="body-text">
              Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.
            </p>
            <p className="body-text">
              California law requires us to let you know how we respond to web browser DNT signals. Because there currently is not an industry or legal standard for recognizing or honoring DNT signals, we do not respond to them at this time.
            </p>
          </section>

          <section id="uslaws" className="privacy-section">
            <h2 className="heading-1">10. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h2>
            <p className="body-text">
              <strong><em>In Short:</em></strong> <em>If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. More information is provided below.</em>
            </p>
            
            <h3 className="heading-2">Categories of Personal Information We Collect</h3>
            <p className="body-text">
              The table below shows the categories of personal information we have collected in the past twelve (12) months. The table includes illustrative examples of each category and does not reflect the personal information we collect from you. For a comprehensive inventory of all personal information we process, please refer to the section <a className="privacy-link" href="#infocollect">WHAT INFORMATION DO WE COLLECT?</a>
            </p>
            
            <table className="privacy-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Examples</th>
                  <th>Collected</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A. Identifiers</td>
                  <td>Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name</td>
                  <td className="text-center">YES</td>
                </tr>
                <tr>
                  <td>B. Personal information as defined in the California Customer Records statute</td>
                  <td>Name, contact information, education, employment, employment history, and financial information</td>
                  <td className="text-center">YES</td>
                </tr>
                <tr>
                  <td>C. Protected classification characteristics under state or federal law</td>
                  <td>Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data</td>
                  <td className="text-center">YES</td>
                </tr>
                <tr>
                  <td>D. Commercial information</td>
                  <td>Transaction information, purchase history, financial details, and payment information</td>
                  <td className="text-center">NO</td>
                </tr>
                <tr>
                  <td>E. Biometric information</td>
                  <td>Fingerprints and voiceprints</td>
                  <td className="text-center">NO</td>
                </tr>
                <tr>
                  <td>F. Internet or other similar network activity</td>
                  <td>Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements</td>
                  <td className="text-center">NO</td>
                </tr>
                <tr>
                  <td>G. Geolocation data</td>
                  <td>Device location</td>
                  <td className="text-center">NO</td>
                </tr>
                <tr>
                  <td>H. Audio, electronic, sensory, or similar information</td>
                  <td>Images and audio, video or call recordings created in connection with our business activities</td>
                  <td className="text-center">NO</td>
                </tr>
                <tr>
                  <td>I. Professional or employment-related information</td>
                  <td>Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us</td>
                  <td className="text-center">YES</td>
                </tr>
                <tr>
                  <td>J. Education Information</td>
                  <td>Student records and directory information</td>
                  <td className="text-center">NO</td>
                </tr>
                <tr>
                  <td>K. Inferences drawn from collected personal information</td>
                  <td>Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual's preferences and characteristics</td>
                  <td className="text-center">NO</td>
                </tr>
                <tr>
                  <td>L. Sensitive personal Information</td>
                  <td></td>
                  <td className="text-center">NO</td>
                </tr>
              </tbody>
            </table>
            
            <p className="body-text">
              We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:
            </p>
            <ul>
              <li className="body-text">Receiving help through our customer support channels;</li>
              <li className="body-text">Participation in customer surveys or contests; and</li>
              <li className="body-text">Facilitation in the delivery of our Services and to respond to your inquiries.</li>
            </ul>
            
            <p className="body-text">
              We will use and retain the collected personal information as needed to provide the Services or for:
            </p>
            <ul>
              <li className="body-text">Category A - As long as the user has an account with us</li>
              <li className="body-text">Category B - As long as the user has an account with us</li>
              <li className="body-text">Category C - As long as the user has an account with us</li>
              <li className="body-text">Category H - As long as the user has an account with us</li>
              <li className="body-text">Category I - As long as the user has an account with us</li>
            </ul>
            
            <h3 className="heading-2">Sources of Personal Information</h3>
            <p className="body-text">
              Learn more about the sources of personal information we collect in <a className="privacy-link" href="#infocollect">WHAT INFORMATION DO WE COLLECT?</a>
            </p>
            
            <h3 className="heading-2">How We Use and Share Personal Information</h3>
            <p className="body-text">
              Learn more about how we use your personal information in the section, <a className="privacy-link" href="#infouse">HOW DO WE PROCESS YOUR INFORMATION?</a>
            </p>
            
            <h3 className="heading-2">Will your information be shared with anyone else?</h3>
            <p className="body-text">
              We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Learn more about how we disclose personal information to in the section, <a className="privacy-link" href="#whoshare">WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a>
            </p>
            <p className="body-text">
              We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be "selling" of your personal information.
            </p>
            <p className="body-text">
              We have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We will not sell or share personal information in the future belonging to website visitors, users, and other consumers.
            </p>
            
            <h3 className="heading-2">Your Rights</h3>
            <p className="body-text">
              You have rights under certain US state data protection laws. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law. These rights include:
            </p>
            <ul>
              <li className="body-text"><strong>Right to know</strong> whether or not we are processing your personal data</li>
              <li className="body-text"><strong>Right to access</strong> your personal data</li>
              <li className="body-text"><strong>Right to correct</strong> inaccuracies in your personal data</li>
              <li className="body-text"><strong>Right to request</strong> the deletion of your personal data</li>
              <li className="body-text"><strong>Right to obtain a copy</strong> of the personal data you previously shared with us</li>
              <li className="body-text"><strong>Right to non-discrimination</strong> for exercising your rights</li>
              <li className="body-text"><strong>Right to opt out</strong> of the processing of your personal data if it is used for targeted advertising (or sharing as defined under California's privacy law), the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects ("profiling")</li>
            </ul>
            
            <p className="body-text">
              Depending upon the state where you live, you may also have the following rights:
            </p>
            <ul>
              <li className="body-text">Right to access the categories of personal data being processed (as permitted by applicable law, including the privacy law in Minnesota)</li>
              <li className="body-text">Right to obtain a list of the categories of third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in California, Delaware, and Maryland)</li>
              <li className="body-text">Right to obtain a list of specific third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in Minnesota and Oregon)</li>
              <li className="body-text">Right to review, understand, question, and correct how personal data has been profiled (as permitted by applicable law, including the privacy law in Minnesota)</li>
              <li className="body-text">Right to limit use and disclosure of sensitive personal data (as permitted by applicable law, including the privacy law in California)</li>
              <li className="body-text">Right to opt out of the collection of sensitive data and personal data collected through the operation of a voice or facial recognition feature (as permitted by applicable law, including the privacy law in Florida)</li>
            </ul>
            
            <h3 className="heading-2">How to Exercise Your Rights</h3>
            <p className="body-text">
              To exercise these rights, you can contact us by submitting a <a className="privacy-link" href="https://app.termly.io/notify/4b9acf44-d8df-437b-b560-c3111b540ab7" target="_blank" rel="noopener noreferrer">data subject access request</a>, by emailing us at simon@iembraceland.com, or by referring to the contact details at the bottom of this document.
            </p>
            <p className="body-text">
              Under certain US state data protection laws, you can designate an authorized agent to make a request on your behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with applicable laws.
            </p>
            
            <h3 className="heading-2">Request Verification</h3>
            <p className="body-text">
              Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. We will only use personal information provided in your request to verify your identity or authority to make the request. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes.
            </p>
            <p className="body-text">
              If you submit the request through an authorized agent, we may need to collect additional information to verify your identity before processing your request and the agent will need to provide a written and signed permission from you to submit such request on your behalf.
            </p>
            
            <h3 className="heading-2">Appeals</h3>
            <p className="body-text">
              Under certain US state data protection laws, if we decline to take action regarding your request, you may appeal our decision by emailing us at simon@iembraceland.com. We will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal is denied, you may submit a complaint to your state attorney general.
            </p>
            
            <h3 className="heading-2">California "Shine The Light" Law</h3>
            <p className="body-text">
              California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us by using the contact details provided in the section <a className="privacy-link" href="#contact">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a>
            </p>
          </section>

          <section id="policyupdates" className="privacy-section">
            <h2 className="heading-1">11. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
            <p className="body-text">
              <strong><em>In Short:</em></strong> <em>Yes, we will update this notice as necessary to stay compliant with relevant laws.</em>
            </p>
            <p className="body-text">
              We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.
            </p>
          </section>

          <section id="contact" className="privacy-section">
            <h2 className="heading-1">12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
            <p className="body-text">
              If you have questions or comments about this notice, you may email us at simon@iembraceland.com or contact us by post at:
            </p>
            <div className="contact-address">
              <p className="body-text">
                iEmbrace LLC<br />
                8 The Green<br />
                Suite B<br />
                Dover, DE 19901<br />
                United States
              </p>
            </div>
          </section>

          <section id="request" className="privacy-section">
            <h2 className="heading-1">13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
            <p className="body-text">
              Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please fill out and submit a <a className="privacy-link" href="https://app.termly.io/notify/4b9acf44-d8df-437b-b560-c3111b540ab7" target="_blank" rel="noopener noreferrer">data subject access request</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}