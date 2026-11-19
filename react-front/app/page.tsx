'use client'

import React from "react";
// import 'bootstrap/dist/css/bootstrap.min.css'; //not necessary if added CDN link

export default function Home() {

    return (
      <>
          <div>
              <h1>Hello world!</h1>
          </div>

          <div>
              <p>Home page includes couple of experiments with CSS.</p>
              <p>For more content - please use tabs to navigate demo.</p>
          </div>

      {/*   carousel with cards - image on one side, flips over to text;
            progressbar at the top;
            */}

          {/*<div className={'display-grid five-col-eq-grid'}>*/}
          <div className={'card-container'}>
              <div className={'flip-card'}>
                  <div className="flip-card-inner">
                      <div className="flip-card-front flipcard-front-tag">
                          <a href="#flip-card-back-1" id="flip-card-anchor-1" className={'transparent-anchor'}>
                              <h1>S</h1>
                          </a>
                      </div>
                      <div id="flip-card-back" className="flip-card-back">
                          <a href="#flip-card-anchor-1" id="flip-card-back-1" className={'transparent-anchor flipcard-back-tag'}>
                            <h1>Single Responsibility</h1>
                          </a>
                      </div>
                  </div>
              </div>
              <div className={'flip-card'}>
                  <div className="flip-card-inner">
                      <div className="flip-card-front flipcard-front-tag">
                          <a href="#flip-card-back-2" id="flip-card-anchor-2" className={'transparent-anchor'}>
                              <h1>O</h1>
                          </a>
                      </div>
                      <div id="flip-card-back" className="flip-card-back">
                          <a href="#flip-card-anchor-2" id="flip-card-back-2" className={'transparent-anchor flipcard-back-tag'}>
                              <h1>Open/Close Principle</h1>
                          </a>
                      </div>
                  </div>
              </div>
              <div className={'flip-card'}>
                  <div className="flip-card-inner">
                      <div className="flip-card-front flipcard-front-tag">
                          <a href="#flip-card-back-3" id="flip-card-anchor-3" className={'transparent-anchor'}>
                              <h1>L</h1>
                          </a>
                      </div>
                      <div id="flip-card-back" className="flip-card-back">
                          <a href="#flip-card-anchor-3" id="flip-card-back-3" className={'transparent-anchor flipcard-back-tag'}>
                              <h1>Liskov Substitution</h1>
                          </a>
                      </div>
                  </div>
              </div>
              <div className={'flip-card'}>
                  <div className="flip-card-inner">
                      <div className="flip-card-front flipcard-front-tag">
                          <a href="#flip-card-back-4" id="flip-card-anchor-4" className={'transparent-anchor'}>
                              <h1>I</h1>
                          </a>
                      </div>
                      <div id="flip-card-back" className="flip-card-back">
                          <a href="#flip-card-anchor-4" id="flip-card-back-4" className={'transparent-anchor flipcard-back-tag'}>
                              <h1>Interface Segregation</h1>
                          </a>
                      </div>
                  </div>
              </div>
              <div className={'flip-card'}>
                  <div className="flip-card-inner">
                      <div className="flip-card-front flipcard-front-tag">
                          <a href="#flip-card-back-5" id="flip-card-anchor-5" className={'transparent-anchor'}>
                              <h1>D</h1>
                          </a>
                      </div>
                      <div id="flip-card-back" className="flip-card-back">
                          <a href="#flip-card-anchor-5" id="flip-card-back-5" className={'transparent-anchor flipcard-back-tag'}>
                              <h1>Dependency Inversion</h1>
                          </a>
                      </div>
                  </div>
              </div>
              <div className={'flip-card'}>
                  <div className="flip-card-inner">
                      <div className="flip-card-front flipcard-front-tag">
                              <h1></h1>
                      </div>
                  </div>
              </div>
              <div className={'flip-card'}>
                  <div className="flip-card-inner">
                      <div className="flip-card-front flipcard-front-tag">
                          <a href="#flip-card-back-6" id="flip-card-anchor-6" className={'transparent-anchor'}>
                              <h1>K</h1>
                          </a>
                      </div>
                      <div id="flip-card-back" className="flip-card-back">
                          <a href="#flip-card-anchor-6" id="flip-card-back-6" className={'transparent-anchor flipcard-back-tag'}>
                              <h1>Keep</h1>
                          </a>
                      </div>
                  </div>
              </div>
              <div className={'flip-card'}>
                  <div className="flip-card-inner">
                      <div className="flip-card-front flipcard-front-tag">
                          <a href="#flip-card-back-7" id="flip-card-anchor-7" className={'transparent-anchor'}>
                              <h1>I</h1>
                          </a>
                      </div>
                      <div id="flip-card-back" className="flip-card-back">
                          <a href="#flip-card-anchor-7" id="flip-card-back-7" className={'transparent-anchor flipcard-back-tag'}>
                              <h1>It</h1>
                          </a>
                      </div>
                  </div>
              </div>
              <div className={'flip-card'}>
                  <div className="flip-card-inner">
                      <div className="flip-card-front flipcard-front-tag">
                          <a href="#flip-card-back-8" id="flip-card-anchor-8" className={'transparent-anchor'}>
                              <h1>S</h1>
                          </a>
                      </div>
                      <div id="flip-card-back" className="flip-card-back">
                          <a href="#flip-card-anchor-8" id="flip-card-back-8" className={'transparent-anchor flipcard-back-tag'}>
                              <h1>Simple</h1>
                          </a>
                      </div>
                  </div>
              </div>
              <div className={'flip-card'}>
                  <div className="flip-card-inner">
                      <div className="flip-card-front flipcard-front-tag">
                          <a href="#flip-card-back-9" id="flip-card-anchor-9" className={'transparent-anchor'}>
                              <h1>S</h1>
                          </a>
                      </div>
                      <div id="flip-card-back" className="flip-card-back">
                          <a href="#flip-card-anchor-9" id="flip-card-back-9" className={'transparent-anchor flipcard-back-tag'}>
                              <h1>Silly</h1>
                          </a>
                      </div>
                  </div>
              </div>
          </div>
      </>
    )


}
